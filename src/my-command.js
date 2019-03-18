import myGoogleAnalytics from 'sketch-module-google-analytics';
myGoogleAnalytics.kUUIDKey = "UA-136184373-1"

const sketch = require('sketch')
const UI = require('sketch/ui')
const { DataSupplier } = sketch
const util = require('util')
var Settings = require('sketch/settings')
export var debugMode = false

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
  if (debugMode) {
    log("OnSupplyData! - Values to look for: " + tmp_gender + ", " + tmp_region)
  } else {
    //TODO:
    
  }

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
        if (!debugMode) {
          googleAnalytics(context,"DataUpdated", "DataUpdated")
        }
        return data.map(function(response) {
          if (debugMode) {
            log(response);
          }
          let name = (response.name + " " + response.surname)
          DataSupplier.supplyDataAtIndex(dataKey, name, index)
          index++
        })
      }
  })
  .catch(function(error) {
    UI.message("❌ Something went wrong - maybe you are offline? ❌")
    if (debugMode) {
      log(error);
    }
  });
}


/*-----------------------------------
//GOOGLE ANALYTICS - START
-----------------------------------*/
export function googleAnalytics(context,category,action,label,value) {
	var trackingID = "UA-136184373-1",
		uuidKey = "google.analytics.uuid",
		uuid = NSUserDefaults.standardUserDefaults().objectForKey(uuidKey);

	if (!uuid) {
		uuid = NSUUID.UUID().UUIDString();
		NSUserDefaults.standardUserDefaults().setObject_forKey(uuid,uuidKey);
	}

	var url = "https://www.google-analytics.com/collect?v=1";
	// Tracking ID
	url += "&tid=" + trackingID;
	// Source
	url += "&ds=sketch" + MSApplicationMetadata.metadata().appVersion;
	// Client ID
	url += "&cid=" + uuid;
	// pageview, screenview, event, transaction, item, social, exception, timing
	url += "&t=event";
	// App Name
	url += "&an=" + encodeURI(context.plugin.name());
	// App ID
	url += "&aid=" + context.plugin.identifier();
	// App Version
	url += "&av=" + context.plugin.version();
	// Event category
	url += "&ec=" + encodeURI(category);
	// Event action
	url += "&ea=" + encodeURI(action);
	// Event label
	if (label) {
		url += "&el=" + encodeURI(label);
	}
	// Event value
	if (value) {
		url += "&ev=" + encodeURI(value);
	}

	var session = NSURLSession.sharedSession(),
		task = session.dataTaskWithURL(NSURL.URLWithString(NSString.stringWithString(url)));

	task.resume();
}
/*-----------------------------------
//GOOGLE ANALYTICS - END
-----------------------------------*/