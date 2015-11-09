angular.module('ZomeViewModule', ['ZomeDefinitionModule', '3DViewModule'])

  .controller('ZomeViewController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview) {
    this.baseAngle = zomeDef().baseAngle;
    this.levelHeight = zomeDef().levelHeight;
    this.orderNumber = zomeDef().orderNumber;

    this.updateZome = function() {
      var pointList = calculator().computePointList(this.orderNumber, this.levelHeight, this.baseAngle);
      var rhombeList = calculator().buildRhombeList(this.orderNumber, pointList);
      zomeDef().levelHeight = this.levelHeight;
      zomeDef().orderNumber = this.orderNumber;
      zomeDef().baseAngle = this.baseAngle;
      zomeDef().pointList = pointList;
      dddview().updateZomeObject(rhombeList, zomeDef().rhombeList);
      zomeDef().rhombeList = rhombeList;
    }

    dddview().init();
    dddview().render();

  }]);
