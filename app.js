const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteButton = document.getElementById('new-quote');
const favoriteBtn = document.getElementById('favorite-btn');
const shareBtn = document.getElementById('share-btn');
const favoritesContent = document.getElementById('favorites-content');

const themeBtn = document.getElementById('theme-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const appContainer = document.querySelector('.app-container');

let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let currentQuote = null;
let currentCategory = 'all';

async function getRandomQuote(category = 'all') {
    return await quotes.getQuote(category);
}

async function displayQuote() {
    quoteElement.style.opacity = '0';
    quoteElement.textContent = 'Loading...';
    authorElement.textContent = '';
    
    try {
        currentQuote = await getRandomQuote(currentCategory);
        setTimeout(() => {
            quoteElement.textContent = `"${currentQuote.text}"`;
            authorElement.textContent = `- ${currentQuote.author}`;
            quoteElement.style.opacity = '1';
            updateFavoriteButton();
        }, 300);
    } catch (error) {
        console.error('Display Error:', error);
        setTimeout(() => {
            quoteElement.textContent = `Error: ${error.message}`;
            authorElement.textContent = 'Please check your internet connection';
            quoteElement.style.opacity = '1';
            currentQuote = null;
            updateFavoriteButton();
        }, 300);
    }
}

function updateFavoriteButton() {
    if (!currentQuote) {
        favoriteBtn.style.display = 'none';
        return;
    }
    favoriteBtn.style.display = 'inline-block';
    const isFavorite = favorites.some(fav => fav.text === currentQuote.text);
    favoriteBtn.classList.toggle('active', isFavorite);
}

function toggleFavorite() {
    const index = favorites.findIndex(fav => fav.text === currentQuote.text);
    if (index === -1) {
        favorites.push(currentQuote);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton();
    displayFavorites();
}

function displayFavorites() {
    if (!favorites.length) {
        favoritesContent.innerHTML = '<p class="no-favorites">No favorite quotes yet.</p>';
        return;
    }

    favoritesContent.innerHTML = favorites
        .map(quote => `
            <div class="favorite-quote">
                <div class="quote-content">
                    <p class="quote-text">"${quote.text}"</p>
                    <p class="quote-author">- ${quote.author}</p>
                </div>
                <button class="remove-favorite" data-text="${quote.text}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', () => {
            const quoteText = button.dataset.text;
            favorites = favorites.filter(fav => fav.text !== quoteText);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
            updateFavoriteButton();
        });
    });
}

function shareQuote() {
    if (navigator.share) {
        navigator.share({
            title: 'Daily Motivation Quote',
            text: `"${currentQuote.text}" - ${currentQuote.author}`,
        });
    } else {
        // Copy to clipboard fallback
        navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
        alert('Quote copied to clipboard!');
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.dataset.theme = 
        document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeBtn.innerHTML = 
        document.body.dataset.theme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.dataset.theme);
}

// View Navigation
function switchView(viewId) {
    views.forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(`${viewId}-view`).classList.remove('hidden');
    
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

// Display initial quote
displayQuote();

// Add event listener for new quote button
newQuoteButton.addEventListener('click', displayQuote);

// Event Listeners
favoriteBtn.addEventListener('click', toggleFavorite);
shareBtn.addEventListener('click', shareQuote);
themeBtn.addEventListener('click', toggleTheme);

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    appContainer.classList.toggle('sidebar-active');
});

document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        appContainer.classList.remove('sidebar-active');
    }
});

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            appContainer.classList.remove('sidebar-active');
        }
    });
});

// Add after other event listeners
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', async () => {
        const category = card.dataset.category;
        currentCategory = category;
        await displayQuote();
        switchView('daily-view');
    });
});

// Initialize
displayFavorites();

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
themeBtn.innerHTML = savedTheme === 'dark' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
