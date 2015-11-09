angular.module('WallDefinitionModule', ['ZomeDefinitionModule', '3DViewModule'])
  .controller('WallDefinitionController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview)  {
    this.height = zomeDef().wallHeight;
    this.changeHeight = function() {
      if (this.height > 0 && zomeDef().levelId > -1) {
        zomeDef().wallHeight = this.height;
        calculator().computeWallPanels(zomeDef());
        dddview().showWalls(zomeDef().wallPanels);
      } else {
        dddview().hideWalls();
      }

    }
  }]);
