import BrowserWindow from 'sketch-module-web-view'
const UI = require('sketch/ui')
var Settings = require('sketch/settings')

export default function (context) {
    console.log("SETTINGS CALLED!!!")

    const options = {
      identifier: 'jane_doe_unique.id',
      width: 320,
      height: 240,
      minWidth: 320,
      minHeight: 240,
      //backgroundColor: "#FF0000",
      alwaysOnTop: true,
      show: true
    }

    var browserWindow = new BrowserWindow(options)

    // only show the window when the page has loaded
    /*browserWindow.once('ready-to-show', () => {
      browserWindow.show()
    })*/

    const webContents = browserWindow.webContents

    // print a message when the page loads
    webContents.on('did-finish-load', () => {
      console.log("did-finish-load")

      //If Plugin was never used, store default values
      if (Settings.settingForKey('my_region') == undefined) {
        Settings.setSettingForKey('my_region', "random")
      }
      if (Settings.settingForKey('my_gender') == undefined) {
        Settings.setSettingForKey('my_gender', "both")
      }
      //console.log("Region: " + Settings.settingForKey('my_region'))
      //console.log("Gender: " + Settings.settingForKey('my_gender'))
      
      //POPULATE PLUGIN WITH PREVIOUS VALUES
      webContents.executeJavaScript(`setDefaultValues("${Settings.settingForKey('my_region')}", "${Settings.settingForKey('my_gender')}")`)
      UI.message('UI loaded!')
    })

    // add a handler for a call from web content's javascript
    webContents.on('nativeLog', (s, region, gender) => {
      console.log(s)
      Settings.setSettingForKey('my_region', region)
      Settings.setSettingForKey('my_gender', gender)
      //console.log("Region: " + Settings.settingForKey('my_region'))
      //console.log("Gender: " + Settings.settingForKey('my_gender'))
      UI.message(s)
      webContents.executeJavaScript(`setRandomNumber(${Math.random()})`)
    })

    browserWindow.loadURL(require('../resources/settings.html'))
  }