angular.module('FloorDefinitionModule', ['ZomeDefinitionModule', '3DViewModule', '3DZomeShapeBuilderModule'])

  .controller('FloorDefinitionController',

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {

    this.floorLevel = zomeDef().levedId;
    this.wireframeVisible = zomeDef().wireframeVisible;
    this.hideAll = zomeDef().hideWireframe;

    this.render = function() {
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    };

    this.changeFloorLevel = function() {
      zomeDef().levelId = this.floorLevel;
      zomeDef().wireframeVisible = true;
      this.wireframeVisible = true;
      calculator().computeWallPanels(zomeDef());
      this.render();
    };
    this.changeVisible = function() {
      zomeDef().wireframeVisible = this.wireframeVisible;
      zomeDef().hideWireframe = this.hideAll;
      this.render();
    };
  }]);
