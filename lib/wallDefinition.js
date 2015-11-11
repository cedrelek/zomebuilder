angular.module('WallDefinitionModule', ['ZomeDefinitionModule', '3DViewModule', '3DZomeShapeBuilderModule'])
  .controller('WallDefinitionController',

  ['zomeDefinitionService', 'zomeCalculatorService', '3DService', '3DZomeShapeBuilderService',

  function(zomeDef, calculator, dddview, dddBuilder)  {
    this.height = zomeDef().wallHeight;
    this.wallsVisible = zomeDef().wallsVisible;

    this.render = function() {
      var viewBuilder = dddBuilder().getViewBuilder(zomeDef());
      dddview().updateView(viewBuilder);
    };

    this.changeHeight = function() {
      if (this.height > 0 && zomeDef().levelId > -1) {
        zomeDef().wallHeight = this.height;
        this.wallsVisible = true;
        zomeDef().wallsVisible = true;
        calculator().computeWallPanels(zomeDef());
      }
      this.render();
    };

    this.changeVisible = function() {
      zomeDef().wallsVisible = this.wallsVisible;
      this.render();
    };
  }]);
