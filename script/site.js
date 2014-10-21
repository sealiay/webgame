
window.web = window.web || {};
window.game = window.game || {};

(function () {
  var site = angular.module("webgame", ["ngRoute"]);
  site.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when("/index.html", {
      templateUrl: "template/home.html",
    }).when("/snake.html", {
      templateUrl: "template/game.html",
    }).when("/digger.html", {
      templateUrl: "template/game.html",
    }).otherwise({
      redirectTo: "/index.html",
    });
  });

  site.directive('webController', function () {
    function controller($scope, $timeout, $sce) {
      $scope.web = web;
      $scope.trust = function(html) { return $sce.trustAsHtml(html); };

      web.apply = function(name, value) {
        $timeout(function () { $scope[name] = value; });
      }
    }
    return {controller: controller};
  });

  site.directive('gameController', function () {
    function controller($scope, $location, $timeout) {
      $scope.game = game;
      $scope.load = function(name) { return "/" + name + "/main.html"; };

      var path = $location.path();
      game.name = path.substr(1, path.length-6);

      game.death = function() {
        game.instance.events.off();
        $("#game-death").show();
      }
    }
    function link(scope, elem) {
      elem.find(".game-play").click(function () {
        $(".popup").hide();
        game.instance = new game.Game();
        game.instance.events.on();
        game.instance.start();
      });
      elem.find(".game-share").click(function () {
        $("#game-share").show();
      });
      elem.find("#game-share").click(function () {
        $("#game-share").hide();
      });
    }
    return {controller: controller, link: link};
  });

  $(document.body).on("touchmove", function (e) { e.preventDefault(); });

})();

