'use strict';

var logic = function ($scope, Channel, Location, createChangeStream, LiveSet) {

  var locationsSrc = new EventSource('/api/Locations/change-stream?_format=event-stream');
  var locationsChanges = createChangeStream(locationsSrc);
  var locations;

  $scope.count = Location.count();

  function getLocations() {
    Location.find().$promise.then(function (result) {
      locations = new LiveSet(result, locationsChanges);
      $scope.Locations = locations.toLiveArray(); //result;
    });
  }

  locationsSrc.onopen = function (event) {
    $scope.online = 'online';
    console.log('getting data again...');
    getLocations();
  };

  locationsSrc.onerror = function (event) {
    console.log('locations -- eventsrc -- error');
    console.log(event);
    $scope.online = '[offline]';
    $scope.$apply();
  };

  /*
  locationsChanges.on('error', function (err) {
    console.log('channels -- changestream -- error');
    console.log(err);
  });
  */

  var channelsSrc = new EventSource('/api/Channels/change-stream?_format=event-stream');
  var channelsChanges = createChangeStream(channelsSrc);
  var channels;

  Channel.find().$promise.then(function (result) {
    channels = new LiveSet(result, channelsChanges);
    $scope.Channels = channels.toLiveArray(); //result;
  });

  $scope.locationSaved = false;
  $scope.channelSaved = false;

  function update(newval, oldval) {
    //TODO: https://github.com/strongloop/loopback-sdk-angular/issues/125
    //data.$save();
    this.prototype$updateAttributes({
      id: newval.id
    }, newval);
  }

  var useModel = {
    'Location': function (callback) {
      return callback.bind(Location);
    },
    'Channel': function (callback) {
      return callback.bind(Channel);
    }
  };

  $scope.done = function (model, newval, oldval) {
    var callback = useModel[model](update);
    callback(newval, oldval);

    console.log('saved');
  };

  $scope.totalDisplayed = 5;
  $scope.loadMore = function () {
    $scope.totalDisplayed += 5;
  };
};

angular.module('yourApp')
  .controller('MainCtrl', [
    '$scope',
    'Channel',
    'Location',
    'createChangeStream',
    'LiveSet',
    logic
]);
