angular.module("ZomeBuilder", ['ViewModule',
                               'ZomeDefinitionModule',
                               'ZomeViewModule',
                               '3DViewModule',
                               'FloorDefinitionModule',
                               'WallDefinitionModule',
                               'RhombeDefinitionModule',
                               '3DZomeShapeBuilderModule',
                               'RhombeViewModule',
                               '3DBeamDefinitionBuilderModule'])

  .controller("InitAppController",

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {
    this.init = function() {
      dddview().init();
      calculator().computeZome(zomeDef());
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    };
  }])
  .directive('zomeViewComp', function() {
    return {
      templateUrl: 'components/zomeView.html',
      restrict: 'E',
      replace: true
    };
  })
  .directive('floorDefinitionComp', function() {
    return {
      templateUrl : 'components/floorDefinition.html',
      restrict : 'E',
      replace : true
    };
  })
  .directive('wallDefinitionComp', function() {
    return {
      templateUrl : 'components/wallDefinition.html',
      restrict : 'E',
      replace : true
    };
  })
  .directive('rhombeViewComp', function() {
    return {
      templateUrl : 'components/rhombeView.html',
      restrict : 'E',
      replace : true
    };
  });
