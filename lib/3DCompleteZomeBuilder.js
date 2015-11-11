angular.module('3DCompleteZomeBuilderModule', [])
  .factory('3DCompleteZomeBuilderService', function() {
    var service = {
      buildRhombeList : function(scene) {
        computeDDDRhombeList(scene);
      },

      removeRhombeList : function(scene) {
        removeRhombeList(scene);

      },

      getViewBuilder : function (rhombeList, wireframe, colorizedBeams) {
        currentDisplayedRhombes = rhombeList;
        wireframeVisible = wireframe;
        colorizedBeamsOption = colorizedBeams;
        return {
          id : "COMPLETE_ZOME_BUILDER",
          build : service.buildRhombeList,
          destruct : service.removeRhombeList
        };
      }
    };

    var currentDisplayedRhombes = [];
    var beamList = [];
    var wireframeVisible = false;
    var colorizedBeamsOption = false;
    function computeDDDRhombeList(scene) {
      removeRhombeList(scene);
      for (var rhombeId = 0; rhombeId < currentDisplayedRhombes.length; rhombeId++) {
        computeDDDBeams(scene, currentDisplayedRhombes[rhombeId]);
      }
    }

    function computeDDDBeams(scene, currentRhombe) {

      for (var beamId = 0; beamId < currentRhombe.frameBeamList.length; beamId++) {
        var currentBeam = currentRhombe.frameBeamList[beamId];
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
        assignUVs(geom);
        geom.computeFaceNormals();
        var material = null;
        if (colorizedBeamsOption) {
          material = colorizedMaterials[beamId % 4];
        } else if (wireframeVisible) {
          material = meshMaterial;
        } else {
          material = plainMaterial;
        }
        var object = new THREE.Mesh(geom, material);
        beamList.push(object);
        scene.add(object);
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

    function assignUVs( geometry ){

        geometry.computeBoundingBox();

        var max     = geometry.boundingBox.max;
        var min     = geometry.boundingBox.min;

        var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

        geometry.faceVertexUvs[0] = [];
        var faces = geometry.faces;

        for (i = 0; i < geometry.faces.length ; i++) {

          var v1 = geometry.vertices[faces[i].a];
          var v2 = geometry.vertices[faces[i].b];
          var v3 = geometry.vertices[faces[i].c];

          geometry.faceVertexUvs[0].push([
            new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
            new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
            new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
          ]);

        }

        geometry.uvsNeedUpdate = true;

    }


    function removeRhombeList(scene) {
      if (beamList.length > 0) {
        for (var beamId = 0; beamId < beamList.length; beamId++) {
          scene.remove(beamList[beamId]);
        }
      }
      beamList = [];
    }

    var plainMaterial = new THREE.MeshPhongMaterial(
      {
        side: THREE.DoubleSide,
        map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg')
      });
    var meshMaterial = new THREE.MeshBasicMaterial(
      {
        color : 0x555555,
        wireframe : true
      });
    var colorizedMaterials = [
      new THREE.MeshPhongMaterial(
          {
            side: THREE.DoubleSide,
            color : 0xDD1111,
            map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg')
          }),
      new THREE.MeshPhongMaterial(
          {
            side: THREE.DoubleSide,
            color: 0x11DD11,
            map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg')
          }),
      new THREE.MeshPhongMaterial(
          {
            side: THREE.DoubleSide,
            color : 0x1111DD,
            map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg')
          }),
      new THREE.MeshPhongMaterial(
          {
            color : 0xDDDD11,
            side: THREE.DoubleSide,
            map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg')
          })
    ];
    return function() { return service; };
});
