angular.module('ZomeViewModule', ['ZomeDefinitionModule', '3DViewModule', '3DZomeShapeBuilderModule'])

  .controller('ZomeViewController',

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {
    this.baseAngle = zomeDef().baseAngle;
    this.levelHeight = zomeDef().levelHeight;
    this.orderNumber = zomeDef().orderNumber;

    this.updateZome = function() {
      zomeDef().levelHeight = this.levelHeight;
      zomeDef().orderNumber = this.orderNumber;
      zomeDef().baseAngle = this.baseAngle;
      calculator().computeZome(zomeDef());
      calculator().computeWallPanels(zomeDef());
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    }

  }]);
