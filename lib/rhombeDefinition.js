angular.module('RhombeDefinitionModule', [])
  .factory('rhombeDefinitionService', function() {
    var service = {
      newRhombe : function() {
        return new def();
      }
    };
    var def = function() {
      this.pointList = [];
      this.width = 10;
      this.height = 30;
      this.frameBeamList = []; // list of object { innerFace , outerFace }
      this.innerBeamList = [];
    };
    return function() { return service; };
  })
  .factory('rhombeCalculatorService', function() {
    var service = {
      computeFrameBeamList : function(rhombe) {
        var innerFaces = computeInnerBeamFaces(rhombe);
        var beams = [];
        for (var faceId = 0; faceId < innerFaces.length; faceId++) {
          var transV = computeNormalTranslationVector(innerFaces[faceId], rhombe.height);
          var beam = {innerFace : innerFaces[faceId], outerFace : translateFace(innerFaces[faceId], transV) };
          beams.push(beam);
        }
        rhombe.frameBeamList = beams;
      }
    };

    function translateFace(face, vector) {
      var res = [];
      for (var pointId = 0; pointId < face.length; pointId++) {
        res.push({
          x : face[pointId].x + vector.x,
          y : face[pointId].y + vector.y,
          z : face[pointId].z + vector.z
        });
      }
      return res;
    }

    function computeNormalTranslationVector(face, width) {
      var u = {
        x : face[1].x - face[0].x,
        y : face[1].y - face[0].y,
        z : face[1].z - face[0].z
      };
      var v = {
        x : face[2].x - face[0].x,
        y : face[2].y - face[0].y,
        z : face[2].z - face[0].z
      };
      var prodVect = computeProduitVectoriel(u, v);
      var unitTranslate = distance({x : 0, y : 0, z : 0}, prodVect);
      var translationDistance = width / unitTranslate;
      return {
        x : prodVect.x * translationDistance,
        y : prodVect.y * translationDistance,
        z : prodVect.z * translationDistance
      };

    }

    function computeProduitVectoriel(u, v) {
      return {
        x : u.y * v.z - u.z * v.y,
        y : u.z * v.x - u.x * v.z,
        z : u.x * v.y - u.y * v.x
      };
    }

    function computeInnerBeamFaces(rhombe) {
      var pOD, pOR, pOU, pOL; // pointOuterDown, Left, Up, Right
      var fDL, fUL, fUR, fDR; // faceDownLeft, UpLeft, UpRight, DownRight
      var h = computeDistanceOfJunctionFromP0(rhombe);

      pOD = computeOuterPoint(rhombe.pointList[0], rhombe.pointList[1], h);
      pOL = computeOuterPoint(rhombe.pointList[1], rhombe.pointList[3], h);
      pOU = computeOuterPoint(rhombe.pointList[3], rhombe.pointList[2], h);
      pOR = computeOuterPoint(rhombe.pointList[2], rhombe.pointList[0], h);

      fDL = computeInnerFace(pOD, rhombe.pointList[1], pOL);
      fUL = computeInnerFace(pOL, rhombe.pointList[3], pOU);
      fUR = computeInnerFace(pOU, rhombe.pointList[2], pOR);
      fDR = computeInnerFace(pOR, rhombe.pointList[0], pOD);
      return [fDL, fUL, fUR, fDR];
    }

    function computeOuterPoint(p0, p1, radius) {
      var spherical = getSphericalCoordFromP0(p0, p1);
      spherical.r = radius;
      return getCartesianCoordFromSphericalP0(p0, spherical);
    }

    function computeInnerFace(p0, p1, p2) {
      var res = [p0, p1, p2];
      var lastPoint = {
        x : p0.x + (p2.x - p1.x),
        y : p0.y + (p2.y - p1.y),
        z : p0.z + (p2.z - p1.z)
      };
      res.push(lastPoint);
      return res;
    }


    function computeDistanceOfJunctionFromP0(rhombe) {
      var h = distance(rhombe.pointList[0], rhombe.pointList[3]); // diagonale verticale
      var d = distance(rhombe.pointList[1], rhombe.pointList[2]); // diagonale horizontale
      return rhombe.width * (h * h + d * d) / (2 * h * d);
    }


    function getCartesianCoordFromSphericalP0(p0, s1) {
      var p1InP0 = {
        x : s1.r * Math.cos(s1.phy) * Math.sin(s1.theta),
        y : s1.r * Math.sin(s1.phy) * Math.sin(s1.theta),
        z : s1.r * Math.cos(s1.theta)
      };
      return {
        x : p1InP0.x + p0.x,
        y : p1InP0.y + p0.y,
        z : p1InP0.z + p0.z,
      };
    }

    function getSphericalCoordFromP0(p0, p1) {
      var translatedP1 = {
        x : p1.x - p0.x,
        y : p1.y - p0.y,
        z : p1.z - p0.z
      };
      var r = distance({x : 0, y : 0, z : 0}, translatedP1);
      return {
        r : r,
        phy : Math.atan2(translatedP1.y, translatedP1.x),
        theta : Math.acos(translatedP1.z / r)
      };
    }

    function distance(p1, p2) {
      return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)
      );
    }


    return function() { return service; };
  });
