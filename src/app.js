var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseBusTimes = function(data) {
    var items = [];
    var countdown, schedTime;// = data.d.stops[0].crossings[0].countdown;
    for(var i = 0; i < data.d.stops[0].crossings.length; i++) {
        schedTime = data.d.stops[0].crossings[i].schedTime;
        countdown = data.d.stops[0].crossings[i].countdown;
        items.push({
            title: 'Scheduled time:' + schedTime,
            subtitle: 'Countdown:' + countdown
        });
    }
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


var getBusTimes = function(routeID, directionID, stopID) {
//var routeNum = 121;
 routeID = 63;
 directionID = 4;
 stopID = 1348;
var busData = {"routeID": routeID,"directionID":directionID,"stopID":stopID,"useArrivalTimes":true};
// Make request to lbt
ajax(
  {
    url:'http://webwatch.lbtransit.com/tmwebwatch/Arrivals.aspx/getStopTimes',
    method: 'post', 
    type:'json',
      data: busData,
    crossDomain: true
  },
  function(data) {
    console.log('Stringified is: ' + JSON.stringify(data));
      
    var menuItems = parseBusTimes(data);
    var resultsMenu = new UI.Menu({
    sections: [{
        title: 'Next Busses',
        items: menuItems
    }]
});

resultsMenu.show();
splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
};

getBusTimes(0,0,0,0);