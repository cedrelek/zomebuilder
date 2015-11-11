angular.module('FloorDefinitionModule', ['ZomeDefinitionModule', '3DViewModule', '3DZomeShapeBuilderModule'])

  .controller('FloorDefinitionController',

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {

    this.floorLevel = zomeDef().levedId;
    this.wireframeVisible = zomeDef().wireframeVisible;
    this.hideAll = zomeDef().hideWireframe;
    this.changeFloorLevel = function() {
      zomeDef().levelId = this.floorLevel;
      zomeDef().wireframeVisible = true;
      this.wireframeVisible = true;
      calculator().computeWallPanels(zomeDef());
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    }
    this.changeVisible = function() {
      zomeDef().wireframeVisible = this.wireframeVisible;
      zomeDef().hideWireframe = this.hideAll;
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    }
  }]);
