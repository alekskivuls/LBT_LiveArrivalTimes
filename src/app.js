var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseBusTimes = function(data) {
    var items = [];
    var countdown, schedTime;// = data.d.stops[0].crossings[0].countdown;
    if(data.d.stops[0].crossings!==null)
    for(var i = 0; i < data.d.stops[0].crossings.length; i++) {
        schedTime = data.d.stops[0].crossings[i].schedTime;
        countdown = data.d.stops[0].crossings[i].countdown;
        items.push({
            title: schedTime,
            subtitle: countdown
        });
    } else items.push({
        title:'No busses'
    });
    return items;
};

var parseStops = function(data) {
    var items = [];
    var name, id;// = data.d.stops[0].crossings[0].countdown;
    for(var i = 0; i < data.d.length; i++) {
        name = data.d[i].name;
        id = data.d[i].id;
        var index = 0, endIndex;
        if(name.indexOf('@') > 0)
           index = name.indexOf('@') + 1;
        if(name.indexOf(' at') > 0)
           index = name.indexOf(' at') + 3;
         if(name.indexOf(' and') > 0)
           index = name.indexOf(' and') + 4;
        if(name.indexOf('&') > 0)
           index = name.indexOf('&') + 1;
        if(name.indexOf('(Published Stop)') > 0)
            endIndex = name.indexOf('(Published Stop)');
        else endIndex = name.length;
        if(index === 0)
            index = endIndex;
        items.push({
            title: name.substring(0, index),
            subtitle: name.substring(index, endIndex),
            id: id
        });
    }
    return items;
};

var parseDirections= function(data) {
    var items = [];
    var direction;
    for(var i = 0; i < data.d.length; i++) {
        direction = data.d[i].name;
        items.push({
            title: direction,
            dir: data.d[i].id
        });
    }
    return items;
};

var parseRoutes = function(data) {
    var items = [];
    var number, name;// = data.d.stops[0].crossings[0].countdown;
    for(var i = 0; i < data.d.length; i++) {
        var fullName = data.d[i].name;
        number = fullName.substring(0, fullName.indexOf('-')-1);
        name = fullName.substring(fullName.indexOf('-')+1);
        items.push({
            title: number,
            subtitle: name,
            id: data.d[i].id
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
  text:'Downloading bus data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();


var getBusTimes = function(routeNum, routeID, directionID, stopID) {
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

var getStops = function(routeNum, routeID, directionID) {
// Make request to lbt
    var busData = {'routeID':routeID,'directionID':directionID};
ajax(
  {
    url:'http://webwatch.lbtransit.com/tmwebwatch/Arrivals.aspx/getStops',
    method: 'post', 
    type:'json',
    data: busData,
    crossDomain: true
  },
  function(data) {
    console.log('Stringified is: ' + JSON.stringify(data));
      
    var menuItems = parseStops(data);
    var resultsMenu = new UI.Menu({
    sections: [{
        title: 'Stops',
        items: menuItems
    }]
    });
    resultsMenu.on('select', function(e) {
    console.log('Item number ' + e.item + ' was pressed!');
    getBusTimes(routeNum, routeID, directionID, e.item.id);
    });

resultsMenu.show();
splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
};

var getDirections = function(routeNum, routeID) {
// Make request to lbt
var busData = {'routeID':routeID};
ajax(
  {
    url:'http://webwatch.lbtransit.com/tmwebwatch/Arrivals.aspx/getDirections',
    method: 'post', 
    type:'json',
    data: busData,
    crossDomain: true
  },
  function(data) {
    console.log('Stringified is: ' + JSON.stringify(data));
      
    var menuItems = parseDirections(data);
    var resultsMenu = new UI.Menu({
    sections: [{
        title: 'Directions',
        items: menuItems
    }]
    });
    resultsMenu.on('select', function(e) {
    console.log('Item number ' + e.item + ' was pressed!');
    getStops(routeNum, routeID, e.item.dir);
    });

resultsMenu.show();
splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
};

var getRoutes = function() {
// Make request to lbt
var busData = {};
ajax(
  {
    url:'http://webwatch.lbtransit.com/tmwebwatch/Arrivals.aspx/getRoutes',
    method: 'post', 
    type:'json',
    data: busData,
    crossDomain: true
  },
  function(data) {
    console.log('Stringified is: ' + JSON.stringify(data));
      
    var menuItems = parseRoutes(data);
    var resultsMenu = new UI.Menu({
    sections: [{
        title: 'Routes',
        items: menuItems
    }]
    });
    resultsMenu.on('select', function(e) {
        console.log('Item number ' + e.item.title + ' was pressed!');
        if(e.item.title === 'Saved')
            getBusTimes(e.item.subtitle, e.item.routeID, e.item.directionID, e.item.stopID);
        else
        getDirections(e.item.title, e.item.id);
    });

resultsMenu.show();
splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
};

getRoutes();