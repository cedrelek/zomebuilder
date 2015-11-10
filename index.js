angular.module("ZomeBuilder", ['ViewModule',
                               'ZomeDefinitionModule',
                               'ZomeViewModule',
                               '3DViewModule',
                               'FloorDefinitionModule',
                             'WallDefinitionModule'])
  .directive('zomeViewComp', function() {
    return {
      templateUrl: 'components/zomeView.html',
      restrict: 'E',
      replace: true
    }
  })
  .directive('floorDefinitionComp', function() {
    return {
      templateUrl : 'components/floorDefinition.html',
      restrict : 'E',
      replace : true
    }
  })
  .directive('wallDefinitionComp', function() {
    return {
      templateUrl : 'components/wallDefinition.html',
      restrict : 'E',
      replace : true
    }
  })
  .controller("InitAppController", ['3DService', 'zomeDefinitionService', 'zomeCalculatorService', function(dddview, zomeDef, calculator) {
    this.init = function() {
      dddview().init();
      calculator().computeZome(zomeDef());
      dddview().updateZome(zomeDef());
    }
  }]);
