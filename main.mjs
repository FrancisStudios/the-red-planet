import { app, BrowserWindow } from 'electron';
import config from './config/config.json' with {type: 'json'};

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: config.App.window.width,
    height: config.App.window.height,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html');

  if (!config.App.window.menu) mainWindow.setMenu(null);
  if (config.App.developer.activated) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() });
app.on('activate', function () { if (mainWindow === null) createWindow() });