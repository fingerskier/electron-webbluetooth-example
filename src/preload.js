const { contextBridge, ipcRenderer } = require('electron/renderer')
const K = require('./constants')


contextBridge.exposeInMainWorld('electronAPI', {
  cancelBluetoothRequest: () => ipcRenderer.send(K.EVENT.BLUETOOTH.CANCEL_REQUEST),
  connectBluetoothDevice: async(name)=>{
    const result = await ipcRenderer.invoke(K.EVENT.BLUETOOTH.CONNECT_DEVICE, name)
    return result
  },
  getBluetoothDevices: async()=>{
    const result = await ipcRenderer.invoke(K.EVENT.BLUETOOTH.GET_DEVICE_LIST)
    return result
  },
  bluetoothPairingRequest: (callback) => ipcRenderer.on(K.EVENT.BLUETOOTH.PAIRING_REQUEST, () => callback()),
  bluetoothPairingResponse: (response) => ipcRenderer.send(K.EVENT.BLUETOOTH.PAIRING_RESPONSE, response)
})