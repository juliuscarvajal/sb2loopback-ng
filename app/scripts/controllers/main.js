'use strict';

angular.module('yourApp')
  .controller('MainCtrl', [
    '$scope',
    'Channel',
    'Location',
    'createChangeStream',
    'LiveSet',
    function ($scope, Channel, Location, createChangeStream, LiveSet) {
      //$scope.sync = function () {};

      var locationsSrc = new EventSource('/api/Locations/change-stream');
      var locationsChanges = createChangeStream(locationsSrc);

      var channelsSrc = new EventSource('/api/Channels/change-stream');
      var channelsChanges = createChangeStream(channelsSrc);

      var locations;
      locationsChanges.on('data', function (update) {
        console.log(update);
        //$scope.Locations = locations.toLiveArray(); //result;
        //$scope.$apply();
      });

      Location.find().$promise.then(function (result) {
        locations = new LiveSet(result, locationsChanges);
        $scope.Locations = locations.toLiveArray(); //result;
        //$scope.Locations = result;
      });

      var channels;
      Channel.find().$promise.then(function (result) {
        channels = new LiveSet(result, channelsChanges);
        $scope.Channels = channels.toLiveArray(); //result;
      });


      $scope.locationSaved = false;
      $scope.channelSaved = false;

      $scope.editingLocation = function (location) {
        //console.log('In edit mode...');
        //location.editing = true;
        //socket.emit('editing', location);
        return location.editing;
      };

      $scope.doneEditingLocation = function (location) {
        console.log(location);
        location.$save(); //TODO: if nothing was changed, don't save...
        location.editing = null;
        //sync();
      };

      $scope.doneEditingChannel = function (channel) {
        console.log(channel);
        channel.$save();
        channel.editing = null;
      };
    }
  ]);
