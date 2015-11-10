angular.module('FloorDefinitionModule', ['ZomeDefinitionModule', '3DViewModule'])
  .controller('FloorDefinitionController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview)  {
    this.floorLevel = zomeDef().levedId;
    this.wireframeVisible = zomeDef().wireframeVisible;
    this.hideAll = zomeDef().hideWireframe;
    this.changeFloorLevel = function() {
      zomeDef().levelId = this.floorLevel;
      zomeDef().wireframeVisible = true;
      this.wireframeVisible = true;
      calculator().computeWallPanels(zomeDef());
      dddview().updateZome(zomeDef());
    }
    this.changeVisible = function() {
      zomeDef().wireframeVisible = this.wireframeVisible;
      zomeDef().hideWireframe = this.hideAll;
      dddview().updateZome(zomeDef());
    }
  }]);
