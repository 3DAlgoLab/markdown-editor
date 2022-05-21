const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  globalShortcut,
  dialog,
} = require('electron');

const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

const template = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click() {
          openFile();
        },
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click() {
          saveFile();
        },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Toggle Bold',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-bold');
        },
      },
      {
        label: 'Toggle Italic',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-italic');
        },
      },
      {
        label: 'Toggle Strike',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-strike');
        },
      },
    ],
  },
  ...(isDev
    ? [
        {
          label: 'Debugging',
          submenu: [
            {
              role: 'toggleDevTools',
            },
            { role: 'reload' },
          ],
        },
      ]
    : []),
  {
    role: 'help',
    submenu: [
      {
        label: 'About Editor Component',
        click() {
          shell.openExternal('https://simplemde.com/');
        },
      },
    ],
  },
];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

function saveFile() {
  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send('editor-event', 'save');
}

function openFile() {
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'PIck a markdown file',
    filter: [
      { name: 'Markdown files', extensions: ['md'] },
      { name: 'Text files', extensions: ['txt'] },
    ],
  };
  dialog
    .showOpenDialog(window, options)
    .then((result) => {
      console.log(result.canceled);
      if (!result.canceled) {
        fs.readFile(result.filePaths[0], 'utf8', (err, content) => {
          if (err) {
            console.error(err);
          } else {
            const title = path.basename(result.filePaths[0]);
            window.webContents.send('editor-event', 'open', title, content);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const createWindow = () => {
  // console.log(path.join(__dirname, 'preload.js'))
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Register Global Shortcuts
  globalShortcut.register('CommandOrControl+S', () => {
    saveFile();
  });

  globalShortcut.register('CommandOrControl+O', () => {
    openFile();
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//Remove default menu for every new window
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('editor-reply', (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

ipcMain.on('save', (event, arg) => {
  console.log(`Received save-content from web page: \n${arg}`);
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Save markdown file',
    filters: [
      {
        name: 'Markdown Files(*.md)',
        extensions: ['md'],
      },
    ],
  };

  dialog
    .showSaveDialog(window, options)
    .then((result) => {
      console.log(result.canceled);
      if (!result.canceled) {
        fs.writeFile(result.filePath, arg, (err) => {
          if (err) {
            console.log(err);
          } else {
            title = path.basename(result.filePath);
            window.webContents.send('editor-event', 'set-title', title);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
