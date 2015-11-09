angular.module('ZomeViewModule', ['ZomeDefinitionModule', '3DViewModule'])

  .controller('ZomeViewController', ['zomeDefinitionService', 'zomeCalculatorService', '3DService', function(zomeDef, calculator, dddview) {
    this.baseAngle = zomeDef().baseAngle;
    this.levelHeight = zomeDef().levelHeight;
    this.orderNumber = zomeDef().orderNumber;
    this.rhombeList = zomeDef().rhombeList;
    this.pointList = zomeDef().pointList
    var rhombeList = [];
    this.updateZome = function() {
      var pointList = calculator().computePointList(this.orderNumber, this.levelHeight, this.baseAngle);
      rhombeList = calculator().buildRhombeList(this.orderNumber, pointList);
      dddview().updateZomeObject(rhombeList);
      dddview().render();
    }
    this.rebuildZome = function() {
      var pointList = calculator().computePointList(this.orderNumber, this.levelHeight, this.baseAngle);
      rhombeList = calculator().buildRhombeList(this.orderNumber, pointList);
      dddview().updateZomeObject(rhombeList);
      dddview().render();
    }

    dddview().init();
    dddview().render();

  }]);
