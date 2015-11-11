angular.module("ZomeBuilder", ['ViewModule',
                               'ZomeDefinitionModule',
                               'ZomeViewModule',
                               '3DViewModule',
                               'FloorDefinitionModule',
                             'WallDefinitionModule',
                           'LogDimensionModule',
                         '3DZomeShapeBuilderModule'])

  .controller("InitAppController",

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {
    this.init = function() {
      dddview().init();
      calculator().computeZome(zomeDef());
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    }
  }])
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
  .directive('logDimensionComp', function() {
    return {
      templateUrl : 'components/logDimension.html',
      restrict : 'E',
      replace : true
    }
  });
