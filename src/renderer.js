async function testIt () {
  setTimeout(() => {
    window.electronAPI.cancelBluetoothRequest()
  }, 7890);
  
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true
  })
  
  console.log('Device:', device)
  
  document.getElementById('device-name').innerHTML = device.name || `ID: ${device.id}`
}

document.getElementById('clickme').addEventListener('click', testIt)


document.getElementById('cancel').addEventListener('click', window.electronAPI.cancelBluetoothRequest)


document.getElementById('connect').addEventListener('click', () => {
  const name = document.getElementById('deviceName').value
  console.log(`Trying to connect to device ${name}`)

  window.electronAPI.connectBluetoothDevice(name, (deviceId) => {
    console.log('Device ID:', deviceId)
  })
})


setInterval(async()=>{
  const devices = await window.electronAPI.getBluetoothDevices()
  
  document.getElementById('device-list').innerHTML = devices.map((device) => {
    return `<li>${device.deviceName}</li>`
  }).join('')
}, 1234)


window.electronAPI.bluetoothPairingRequest((event, details) => {
  const response = {}

  switch (details.pairingKind) {
    case 'confirm': {
      response.confirmed = window.confirm(`Do you want to connect to device ${details.deviceId}?`)
      break
    }
    case 'confirmPin': {
      response.confirmed = window.confirm(`Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`)
      break
    }
    case 'providePin': {
      const pin = window.prompt(`Please provide a pin for ${details.deviceId}.`)
      if (pin) {
        response.pin = pin
        response.confirmed = true
      } else {
        response.confirmed = false
      }
    }
  }

  window.electronAPI.bluetoothPairingResponse(response)
})