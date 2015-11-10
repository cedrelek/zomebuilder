angular.module('ZomeViewModule', ['ZomeDefinitionModule', '3DViewModule'])

  .controller('ZomeViewController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview) {
    this.baseAngle = zomeDef().baseAngle;
    this.levelHeight = zomeDef().levelHeight;
    this.orderNumber = zomeDef().orderNumber;

    this.updateZome = function() {
      zomeDef().levelHeight = this.levelHeight;
      zomeDef().orderNumber = this.orderNumber;
      zomeDef().baseAngle = this.baseAngle;
      calculator().computeZome(zomeDef());
      calculator().computeWallPanels(zomeDef());
      dddview().updateZome(zomeDef());
    }

  }]);
