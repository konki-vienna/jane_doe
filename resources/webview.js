// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function(e) {
  //e.preventDefault();
});

document.getElementById('button').addEventListener('click', function () {
  console.log("here - within webview.js")
  var my_region = document.getElementById('region_select').value
  var my_gender = document.getElementById('gender_select').value
  window.postMessage('nativeLog', 'Called from the webview', my_region, my_gender)
})

document.getElementById('region_select').addEventListener('onchange', function () {
  console.log("Region changed to: ")
})

// called from the plugin
window.setRandomNumber = function (randomNumber) {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
}

window.setDefaultValues = function (my_region, my_gender) {
  console.log("setDefaultValues")
  console.log(my_region + ", " + my_gender)
  document.getElementById('region_select').value = my_region
  document.getElementById('gender_select').value = my_gender
}
