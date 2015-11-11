angular.module('3DBeamDefinitionBuilderModule', [])
  .factory('3DBeamDefinitionBuilderService', function() {
    var service = {

      buildZome : function(scene) {
        computeDDDBeams(scene);
      },

      removeZome : function(scene) {
        removeBeams(scene);
      },

      getViewBuilder : function (rhombe) {
        currentDisplayedRhombe = rhombe;
        return {
          id : "BEAM_DEFINITION_BUILDER",
          build : service.buildZome,
          destruct : service.removeZome
        };
      }
    };

    var currentDisplayedRhombe = null;
    var dddBeamObjects = [];

    function computeDDDBeams(scene) {
      removeBeams(scene);

      for (var beamId = 0; beamId < currentDisplayedRhombe.frameBeamList.length; beamId++) {
        var currentBeam = currentDisplayedRhombe.frameBeamList[beamId];
        var geom = new THREE.Geometry();
        var pointId;
        for (pointId = 0; pointId < currentBeam.innerFace.length; pointId++) {
          addVector(currentBeam.innerFace[pointId], geom);
        }
        for (pointId = 0; pointId < currentBeam.outerFace.length; pointId++) {
          addVector(currentBeam.outerFace[pointId], geom);
        }
        addFace(0, 1, 2, 3, geom); // Inner/bottom face
        addFace(0, 4, 5, 1, geom); // left cutted face
        addFace(2, 3, 7, 6, geom); // right cutted face
        addFace(0, 4, 7, 3, geom); // front side face
        addFace(1, 2, 6, 5, geom); // back side face
        addFace(4, 5, 6, 7, geom); // outer/top face
        geom.computeFaceNormals();
        var object = new THREE.Mesh(geom, plainMaterials[beamId % 4]);
        dddBeamObjects.push(object);
        scene.add(object);
      }
    }
    function removeBeams(scene) {
      if (dddBeamObjects.length > 0) {
        for (var i = 0; i < dddBeamObjects.length; i++) scene.remove(dddBeamObjects[i]);
        dddBeamObjects = [];
      }
    }

    function addVector(point, geom) {
      var dddpoint = new THREE.Vector3(point.x, point.y, point.z);
      geom.vertices.push(dddpoint);
    }

    function addFace(p0, p1, p2, p3, geom) {
      geom.faces.push(new THREE.Face3(p0, p1, p2));
      geom.faces.push(new THREE.Face3(p0, p2, p3));
    }

    var plainMaterials = [
      new THREE.MeshLambertMaterial(
          {
            color: 0x11DD11,
            side: THREE.DoubleSide
          }),
      new THREE.MeshLambertMaterial(
          {
            color: 0x11DDDD,
            side: THREE.DoubleSide
          }),
      new THREE.MeshLambertMaterial(
          {
            color: 0x1111DD,
            side: THREE.DoubleSide
          }),
      new THREE.MeshLambertMaterial(
                {
                  color: 0xDD1111,
                  side: THREE.DoubleSide
                })
    ];

    return function() { return service; };
  });
