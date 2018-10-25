const sketch = require('sketch')
const { DataSupplier } = sketch
const util = require('util')

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
  
  const myLength = 5;//items.length;
  console.log("OnSupplyData!!!")
  getNames(context, myLength, "female", "Germany");
}

export function getNames(myContext, myAmount, myGender, myRegion) {
  const url = "https://uinames.com/api/?amount=" + myAmount + "&gender=" + myGender + "&region=" + myRegion;
  let myNames;
  let dataKey = myContext.data.key
  const items = util.toArray(myContext.data.items).map(sketch.fromNative)

  fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      let index = 0;
      return data.map(function(userName) {
        console.log(userName);
        let name = (userName.name + " " + userName.surname)
        DataSupplier.supplyDataAtIndex(dataKey, name, index)
        index++
      })      
  })
  .catch(function(error) {
    console.log(error);
  });
}

export function onSettings(context) {
  console.log("SETTINGS CALLED!!!")
}