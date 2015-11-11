angular.module('ViewModule', [])
  .factory("viewService", function() {
    var view = { currentView : 1 };
    return function() {return view;};
  })
  .controller("viewController", ["viewService", function(view) {
    this.view = view();
  }]);
