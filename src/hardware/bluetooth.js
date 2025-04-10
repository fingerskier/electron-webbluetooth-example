let bluetoothPinCallback = ()=>{}
let devices = []
let selectBluetoothCallback = ()=>{}


module.exports = {
  cancelBluetoothRequest: (event) => {
    selectBluetoothCallback('')
  },


  connectBluetoothDevice: (name)=>{
    const result = devices.find((device) => {
      return device.deviceName === name
    })

    console.log('Found this device', result)
    
    if (result) {
      console.log('Selected device:', result)
      return result.deviceId
    } else {
      // The device wasn't found so we need to either wait longer (eg until the
      // device is turned on) or until the user cancels the request
    }
  },


  getDevices: ()=>{
    return devices
  },


  handleBluetoothPairingResponse: (event, response) => {
    bluetoothPinCallback(response)
  },


  selectBluetoothDevice: (event, deviceList, callback) => {
    event.preventDefault()
    selectBluetoothCallback = callback
    
    devices = deviceList
  },


  setBluetoothPairingHandler: mainWindow => {
    mainWindow.webContents.session.setBluetoothPairingHandler((details, callback) => {
      bluetoothPinCallback = callback
      // Send a message to the renderer to prompt the user to confirm the pairing.
      mainWindow.webContents.send('bluetooth-pairing-request', details)
    })
  },
}