const { Menu, shell, BrowserWindow } = require('electron');

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

const template = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
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

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
