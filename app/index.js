/**
 * @file UI controller
 * @author Dafrok
 */

const {ipcRenderer} = require('electron');
ipcRenderer.send('ready');
ipcRenderer.on('ready-reply', (e, list) => {
    for (const path of list) {
        const $item = document.createElement('div');
        $item.innerText = path;
        $item.style.borderBottom = '1px dotted #ccc';
        document.body.appendChild($item);
    }
});
