angular.module("ZomeBuilder", ["ViewModule",
                               "ZomeDefinitionModule",
                               "ZomeViewModule"])
  .directive("zomeViewComp", function() {
    return {
      templateUrl: 'components/zomeView.html',
      restrict: 'E',
      replace: true
    }
  });
