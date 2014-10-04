
window.web = window.web || {};

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

  site.directive('gameController', function () {
    function controller($scope, $location, $timeout, $sce, $rootScope) {
      var path = $location.path();
      $scope.name = path.substr(1, path.length-6);

      $scope.load = function(name) { return "/" + name + "/main.html"; };
      $scope.trust = function(html) { return $sce.trustAsHtml(html); };

      web.apply = function(name, value, root) {
        $timeout(function () { (root ? $rootScope : $scope)[name] = value; });
      }
      web.death = function() {
        $("#game-death").show();
      }
    }
    function link(scope, elem) {
      elem.find(".game-play").click(function () {
        $(".popup").hide();
        var game = new web.Game();
        game.events.on();
        game.start();
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

