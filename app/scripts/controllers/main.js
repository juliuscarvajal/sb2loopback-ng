'use strict';

angular.module('yourApp')
  .controller('MainCtrl', [
    '$scope',
    'Channel',
    'Location',
    function ($scope, Channel, Location) {

      console.log(Channel);

      //$scope.sync = function () {};

      Channel.find().$promise.then(function (result) {
        $scope.Channels = result;
      });

      Location.find().$promise.then(function (result) {
        $scope.Locations = result;
      });

      $scope.locationSaved = false;
      $scope.channelSaved = false;

      $scope.editingLocation = function (location) {
        console.log('In edit mode...');
        location.editing = true;
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
