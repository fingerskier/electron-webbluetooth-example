const { app, BrowserWindow, ipcMain } = require('electron');
const K = require('./constants')
const path = require('path')
const {
  cancelBluetoothRequest,
  connectBluetoothDevice,
  getDevices,
  handleBluetoothPairingResponse,
  selectBluetoothDevice,
  setBluetoothPairingHandler,
} = require('./hardware/bluetooth')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })


  mainWindow.webContents.on('select-bluetooth-device', selectBluetoothDevice)
  
  ipcMain.on(K.EVENT.BLUETOOTH.CANCEL_REQUEST, cancelBluetoothRequest)
  
  ipcMain.handle(K.EVENT.BLUETOOTH.CONNECT_DEVICE, async(event, ...args)=>{
    const [name] = args
    console.log('connect-bluetooth-device:', name)
    connectBluetoothDevice(name)
  })
  
  ipcMain.handle(K.EVENT.BLUETOOTH.GET_DEVICE_LIST, ()=>{
    const result = getDevices()
    return result
  })

  ipcMain.on(K.EVENT.BLUETOOTH.PAIRING_RESPONSE, handleBluetoothPairingResponse)

  setBluetoothPairingHandler(mainWindow)
  

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};


app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})
