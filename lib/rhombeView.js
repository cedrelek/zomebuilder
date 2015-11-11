angular.module('RhombeViewModule', ['RhombeDefinitionModule', '3DBeamDefinitionBuilderModule', '3DViewModule'])

  .controller('RhombeViewController',

  ['zomeDefinitionService', 'rhombeDefinitionService', 'rhombeCalculatorService', '3DBeamDefinitionBuilderService', '3DService',

  function(zomeDef, rhombeDef, calculator, dddBuilder, dddview) {

    this.width = 10;
    this.height = 30;

    this.render = function() {
      zomeDef().beamSize.width = this.width;
      zomeDef().beamSize.height = this.height;
      rhombe1.width = this.width;
      rhombe1.height = this.height;
      calculator().computeFrameBeamList(rhombe1);
      var builder = dddBuilder().getViewBuilder(rhombe1);
      dddview().updateView(builder);
    };

    var rhombe1 = rhombeDef().newRhombe();
    rhombe1.pointList.push({x : 0, y : 0, z :0});
    rhombe1.pointList.push({x : -300, y : 50, z :0});
    rhombe1.pointList.push({x : 300, y : 50, z :0});
    rhombe1.pointList.push({x : 0, y : 100, z :0});

    calculator().computeFrameBeamList(rhombe1);

  }]);
