angular.module('FloorDefinitionModule', ['ZomeDefinitionModule', '3DViewModule'])
  .controller('FloorDefinitionController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview)  {
    this.floorLevel = zomeDef().levedId;
    this.changeFloorLevel = function() {
      zomeDef().levelId = this.floorLevel;
      dddview().hideLevel(this.floorLevel);
    }
  }]);
