var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase() + title.substring(1);

    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

    // Add to menu items array
    items.push({
      title:title,
      subtitle:time
    });
  }

  // Finally return whole array
  return items;
};

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading weather data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();



//var routeNum = 121;
var routeID = 63;
var directionID = 4;
var stopID = 1348;
var busData = {"routeID": routeID,"directionID":directionID,"stopID":stopID,"useArrivalTimes":true};
// Make request to openweathermap.org
ajax(
  {
    url:'http://webwatch.lbtransit.com/tmwebwatch/Arrivals.aspx/getStopTimes',
    method: 'post', 
    type:'json',
      data: busData,
    crossDomain: true
  },
  function(data) {
    console.log('Success and Result is: ' + data);
    console.log('Stringified is: ' + JSON.stringify(data));
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);