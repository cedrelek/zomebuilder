angular.module('WallDefinitionModule', ['ZomeDefinitionModule', '3DViewModule'])
  .controller('WallDefinitionController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview)  {
    this.height = zomeDef().wallHeight;
    this.wallsVisible = zomeDef().wallsVisible;
    this.changeHeight = function() {
      if (this.height > 0 && zomeDef().levelId > -1) {
        zomeDef().wallHeight = this.height;
        this.wallsVisible = true;
        zomeDef().wallsVisible = true;
        calculator().computeWallPanels(zomeDef());
      }
      dddview().updateZome(zomeDef());
    }
    this.changeVisible = function() {
      zomeDef().wallsVisible = this.wallsVisible;
      dddview().updateZome(zomeDef());
    }
  }]);
