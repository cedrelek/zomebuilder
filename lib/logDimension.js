angular.module('LogDimensionModule', ["ZomeDefinitionModule"])

  .controller('LogDimensionController', ["zomeDefinitionService", function(zomeDef) {
    this.logDimension = zomeDef().logDimension;
}]);
