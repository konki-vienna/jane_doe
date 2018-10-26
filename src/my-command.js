const sketch = require('sketch')
const UI = require('sketch/ui')
const { DataSupplier } = sketch
const util = require('util')
var Settings = require('sketch/settings')

export function onStartup () {
  // To register the plugin, uncomment the relevant type:
  DataSupplier.registerDataSupplier('public.text', 'Jane_Doe', 'SupplyData')
  // DataSupplier.registerDataSupplier('public.image', 'Jane_Doe', 'SupplyData')
}

export function onShutdown () {
  // Deregister the plugin
  DataSupplier.deregisterDataSuppliers()
}

export function onSupplyData (context) {
  let dataKey = context.data.key

  var document = sketch.getSelectedDocument()
  var selection = document.selectedLayers
  const myLength = selection.length
  
  /*log(selection.isEmpty)
  log(selection.length)
  selection.forEach(function(item) {
    log(item.name)
    log(item.name)
  })*/

  getNames(context, myLength);
}

//HELPER FUNCTION TO GET REGION-SETTINGS
function getRegion() {
  let tmp_region
  if (Settings.settingForKey('my_region') == undefined) {
    tmp_region = "random";
  } else {
    tmp_region = Settings.settingForKey('my_region')
  }
  Settings.setSettingForKey('my_region', tmp_region)
  return tmp_region
}

//HELPER FUNCTION TO GET GENDER-SETTINGS
function getGender() {
  let tmp_gender
  if (Settings.settingForKey('my_gender') == undefined) {
    tmp_gender = "both"
  } else {
    tmp_gender = Settings.settingForKey('my_gender')
  }
  Settings.setSettingForKey('my_gender', tmp_gender)
  return tmp_gender
}

export function getNames(myContext, myAmount) {
  let tmp_gender = getGender()
  let tmp_region = getRegion()
  log("OnSupplyData! - Values to look for: " + tmp_gender + ", " + tmp_region)

  //let url = "https://uinames.com/api/?amount=" + myAmount + "&gender=" + myGender + "&region=" + myRegion;
  let url = "https://uinames.com/api/?amount=" + myAmount
  if (tmp_region != "random") {
    url += "&region=" + tmp_region
  }
  if (tmp_gender != "both") {
    url += "&gender=" + tmp_gender
  }

  let myNames;
  let dataKey = myContext.data.key
  const items = util.toArray(myContext.data.items).map(sketch.fromNative)

  UI.message("🔦 Looking for localized names on uinames.com... 🔦")

  fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      let index = 0;
      //log(data.length)
      //WEIRD BUG IF data.length = undefined (BECAUSE ONLY A SINGLE ELEMENT IS SELECTED)
      if (data.length == undefined) {
        UI.message("❌ Please select more than one element. ❌")
      } else {
        UI.message("✅ Retrieved " + data.length + " localized name from " + data[0].region +  ". ✅")
        return data.map(function(response) {
          log(response);
          let name = (response.name + " " + response.surname)
          DataSupplier.supplyDataAtIndex(dataKey, name, index)
          index++
        })
      }
  })
  .catch(function(error) {
    UI.message("❌ Something went wrong - has the WIX-GUEST WLAN disconnected you again? 😉 ❌")
    log(error);
  });
}

export function onSettings(context) {
  log("SETTINGS CALLED!!!")
}