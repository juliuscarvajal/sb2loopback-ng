'use strict';

angular.module('yourApp')
  .controller('MainCtrl', [
    '$scope',
    'Channel',
    'Location',
    'createChangeStream',
    'LiveSet',
    '$window',
    '$interval',
    function ($scope, Channel, Location, createChangeStream, LiveSet, $window, $interval) {
      var locationsSrc = new EventSource('/api/Locations/change-stream');
      var locationsChanges = createChangeStream(locationsSrc);
      var locations;

      function getLocations() {
        Location.find().$promise.then(function (result) {
          locations = new LiveSet(result, locationsChanges);
          $scope.Locations = locations.toLiveArray(); //result;
        });
      }

      locationsSrc.onopen = function (event) {
        $scope.online = 'online';
        $scope.$apply();
        getLocations();
      };

      locationsSrc.onerror = function (event) {
        $scope.online = '[offline]';
        $scope.$apply();
      };

      var channelsSrc = new EventSource('/api/Channels/change-stream');
      var channelsChanges = createChangeStream(channelsSrc);

      getLocations();
      locationsChanges.on('data', function (update) {
        getLocations();
      });

      var channels;
      Channel.find().$promise.then(function (result) {
        channels = new LiveSet(result, channelsChanges);
        $scope.Channels = channels.toLiveArray(); //result;
      });


      $scope.locationSaved = false;
      $scope.channelSaved = false;

      $scope.editingLocation = function (location) {
        return location.editing;
      };

      $scope.doneEditingLocation = function (location, field, oldval) {
        //check blanks or unchanged values.
        console.log(field);
        console.log(oldval);
        console.log(location);

        if (location[field] === '') {
          location[field] = oldval;
          return;
        }

        location.$save();
        location.editing = null;

        console.log('saved');
      };

      $scope.doneEditingChannel = function (channel) {
        console.log(channel);
        channel.$save();
        channel.editing = null;
      };
        }]);
