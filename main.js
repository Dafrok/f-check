const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const rootPath = app.getAppPath();

let mainWindow = null;

ipcMain.on('close', app.quit);
ipcMain.on('minimize', () => mainWindow.minimize());

exports.getWindow = () => mainWindow;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, './app/bg.png'),
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.setMenu(null);

    function openWindow() {
        mainWindow.loadFile('app/index.html');
    }
    openWindow();

    return mainWindow;
}

app.whenReady().then(() => {
    mainWindow = createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    app.quit();
});

function check() {
    function listFile(dir, list = []) {
        const arr = fs.readdirSync(dir);
        arr.forEach(function (item) {
            const fullpath = path.join(dir, item);
            const stats = fs.statSync(fullpath);
            if (stats.isDirectory()) {
                listFile(fullpath, list);
            }
            const basename = path.basename(fullpath);
            if (/[\\\/\:\*\?\"\<\>|]/.test(basename)) {
                list.push(fullpath);
            }
        });
        return list;
    }
    let targetPath = './';
    if (process.platform === 'darwin') {
        targetPath = '../../../../';
    }
    const list = listFile(path.resolve(rootPath, targetPath));
    return list;
}

ipcMain.on('ready', (event, arg) => {
    event.reply('ready-reply', check());
});
