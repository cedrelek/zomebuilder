angular.module('ZomeDefinitionModule', [])
  .factory('zomeDefinitionService', function() {
    var def = {
      orderNumber : 5,
      levelHeight : 10,
      baseAngle : 35,
      // Liste de losanges
      // Un losange est un tableau de 4 points x, y, z
      rhombeList : [],
      pointList : [],

    };
    return function() { return def }
  })
  .factory('zomeCalculatorService', function() {
    var calculator = {

      /*
      * Link the point together to build the list of Rhombes.
      */
      buildRhombeList : function(orderNumber, pointList) {
        var rhombeList = [];
        for (var levelId = 1; levelId < orderNumber; levelId++) {
          for (var i = 0; i < orderNumber; i++) {
            var p0 = (levelId == 1) ? calculator.getNamedPoint("S0", pointList) : calculator.getReferencedPoint(i, levelId - 2, pointList);
            var p1;
            var p2;
            if (levelId % 2 == 1) {
               p1 = calculator.getReferencedPoint((i -1 + orderNumber) % orderNumber, levelId - 1, pointList);
               p2 = calculator.getReferencedPoint(i, levelId - 1, pointList);
            } else {
               p1 = calculator.getReferencedPoint(i, levelId - 1, pointList);
               p2 = calculator.getReferencedPoint((i+1) % orderNumber, levelId - 1, pointList);
            }
            var p3 = (levelId == orderNumber - 1) ? calculator.getNamedPoint("SN", pointList) : calculator.getReferencedPoint(i, levelId, pointList);
            rhombeList.push([
              p0,
              p1,
              p2,
              p3
            ]);
          }
        }
        return rhombeList;
      },

      /*
      * Compute the rhomeList
      */
      computePointList : function(orderNumber, levelHeight, baseAngle) {
        var pointList = calculator.computeFirstCrown(orderNumber, levelHeight, baseAngle);
        pointList.push({x : 0, y : 0, z : 0, id : {name : "S0"}});
        pointList.push({x : 0, y : levelHeight * orderNumber, z : 0, id : {name : "SN"}});

        for (var curLevel = 1; curLevel < orderNumber - 1; curLevel++) {
          for (var i = 0; i < orderNumber; i++) {
            var p0 = (curLevel == 1) ? calculator.getNamedPoint("S0", pointList) : calculator.getReferencedPoint(i, curLevel - 2, pointList);
            var p1;
            var p2;
            if (curLevel % 2 == 1) {
               p1 = calculator.getReferencedPoint((i -1 + orderNumber) % orderNumber, curLevel - 1, pointList);
               p2 = calculator.getReferencedPoint(i, curLevel - 1, pointList);
            } else {
               p1 = calculator.getReferencedPoint(i, curLevel - 1, pointList);
               p2 = calculator.getReferencedPoint((i+1) % orderNumber, curLevel - 1, pointList);
            }

            pointList.push(calculator.computeSummitFrom3Points(p0, p1, p2, i, curLevel));
          }
        }

        return pointList;
      },

      /*
      * convert degre to rad
      */
      toRad : function(angle) {
        return Math.PI * angle / 180;
      },

      /*
      * Compute the first crown
      * Return a list of point P01, Pi1, P(n-1)1...
      */
      computeFirstCrown : function(orderNumber, levelHeight, baseAngle) {
        var crownPointList = [];
        for (var i = 0; i < orderNumber; i++) {
          var curPoint = {
            x : levelHeight / Math.tan(Math.PI / 2 - calculator.toRad(baseAngle)) * Math.cos(Math.PI * 2 * i / orderNumber),
            y : levelHeight,
            z : levelHeight / Math.tan(Math.PI / 2 - calculator.toRad(baseAngle)) * Math.sin(Math.PI * 2 * i / orderNumber),
            id : { name : "P" + i + "0",
                   i : i,
                   levelId : 0}
          };
          crownPointList.push(curPoint);
        }
        return crownPointList;
      },

      /*
      * Return a referenced point from a ref
      */
      getReferencedPoint : function(i, levelId, pointList) {
        for (var curI = 0; curI < pointList.length; curI++) {
          if (pointList[curI].id.i == i && pointList[curI].id.levelId == levelId) return pointList[curI];
        }
        console.error("Could not find the point P" + i + levelId);
        return null;
      },

      /*
      * Return a named point from a list
      */
      getNamedPoint : function(name, pointList) {
        for (var i = 0; i < pointList.length; i++) {
          if (pointList[i].id.name == name) return pointList[i];
        }
        console.error("Could not find the point named : " + name);
        return null;
      },

      /*
      * Calcul du 4eme point par rapport P1, P2, P3
      */
      computeSummitFrom3Points : function(p0, p1, p2, i, levelId) {
        return {
          x : p1.x + p2.x - p0.x,
          y : p1.y + p2.y - p0.y,
          z : p1.z + p2.z - p0.z,
          id : {i: i, levelId: levelId, name : "P" + i + levelId}
        };
      }
    };
    return function() { return calculator; }
  });
