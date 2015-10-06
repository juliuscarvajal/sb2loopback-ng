'use strict';

angular.module('yourApp')
  .controller('MainCtrl', [
    '$scope',
    'Channel',
    'Location',
    'createChangeStream',
    'LiveSet',
  function ($scope, Channel, Location, createChangeStream, LiveSet) {

      var locationsSrc = new EventSource('/api/Locations/change-stream?_format=event-stream');
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
        console.log('locations -- eventsrc -- error');
        console.log(event);
        $scope.online = '[offline]';
        $scope.$apply();
      };

      getLocations();
      locationsChanges.on('data', function (update) {
        getLocations();
      });

      locationsChanges.on('error', function (err) {
        console.log('channels -- changestream -- error');
        console.log(err);
      });

      /////////////////////////////////////
      var channelsSrc = new EventSource('/api/Channels/change-stream?_format=event-stream');
      var channelsChanges = createChangeStream(channelsSrc);
      var channels;

      function getChannels() {
        Channel.find().$promise.then(function (result) {
          channels = new LiveSet(result, channelsChanges);
          $scope.Channels = channels.toLiveArray(); //result;
        });
      }

      channelsSrc.onopen = function (event) {
        $scope.online = 'online';
        $scope.$apply();
        getLocations();
      };

      channelsSrc.onerror = function (event) {
        console.log('channels -- eventsrc -- error');
        console.log(event);
        $scope.online = '[offline]';
        $scope.$apply();
      };

      getChannels();
      channelsChanges.on('data', function (update) {
        getChannels();
      });

      channelsChanges.on('error', function (err) {
        console.log('locations -- changestream -- error');
        console.log(err);
      });

      $scope.locationSaved = false;
      $scope.channelSaved = false;

      $scope.editingLocation = function (location) {
        location.editing = 'true';
      };

      $scope.done = function (location, field, oldval) {
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

      $scope.totalDisplayed = 20;
      $scope.loadMore = function () {
        $scope.totalDisplayed += 20;
      };
  }]);
