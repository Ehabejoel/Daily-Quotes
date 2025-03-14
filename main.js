const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true
    }
  });

  // Enable API requests
  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({
      requestHeaders: {
        ...details.requestHeaders,
        'X-Api-Key': 'IDhzjzTT5iXJHzZWm+5MOg==jq4TUEtRDhKXa9yf'
      }
    });
  });

  // Development shortcut (Ctrl+Shift+I to open DevTools)
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    win.webContents.toggleDevTools();
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
