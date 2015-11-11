angular.module('CompleteZomeViewModule',
  ['ZomeDefinitionModule',
   '3DViewModule',
   '3DCompleteZomeBuilderModule',
   'RhombeDefinitionModule'])

  .controller('CompleteZomeViewController',
  [ 'zomeDefinitionService', 'rhombeDefinitionService', 'rhombeCalculatorService', '3DService', '3DCompleteZomeBuilderService',
    function(zomeDef, rhombeDef, rhombeCalculator, dddview, dddbuilder) {
      this.wireframe = false;
      this.colorizedBeams = false;
      this.render = function() {
        var rhombeId;
        var rhombeList = [];
        var curRhombe;
        for (rhombeId = 0; rhombeId < zomeDef().rhombeList.length; rhombeId++) {
          if (zomeDef().rhombeList[rhombeId][0].id.levelId >= zomeDef().levelId) {
            curRhombe = rhombeDef().newRhombe();
            curRhombe.width = zomeDef().beamSize.width;
            curRhombe.height = zomeDef().beamSize.height;
            curRhombe.pointList = zomeDef().rhombeList[rhombeId];
            rhombeCalculator().computeFrameBeamList(curRhombe);
            rhombeList.push(curRhombe);
          }
        }
        for (rhombeId = 0; rhombeId < zomeDef().wallPanels.rectanglePanels.length; rhombeId++) {
          curRhombe = rhombeDef().newRhombe();
          curRhombe.width = zomeDef().beamSize.width;
          curRhombe.height = zomeDef().beamSize.height;
          curRhombe.pointList = zomeDef().wallPanels.rectanglePanels[rhombeId];
          rhombeCalculator().computeFrameBeamList(curRhombe);
          rhombeList.push(curRhombe);
        }
        var builder = dddbuilder().getViewBuilder(rhombeList, this.wireframe, this.colorizedBeams);
        dddview().updateView(builder);
      };
  }]);
