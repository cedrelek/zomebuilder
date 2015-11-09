angular.module("ZomeBuilder", ["ViewModule",
                               "ZomeDefinitionModule",
                               "ZomeViewModule",
                               "3DViewModule"])
  .directive("zomeViewComp", function() {
    return {
      templateUrl: 'components/zomeView.html',
      restrict: 'E',
      replace: true
    }
  });
