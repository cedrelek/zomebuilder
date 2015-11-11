angular.module('3DZomeShapeBuilderModule', [])
  .factory('3DZomeShapeBuilderService', function() {
    var service = {


      buildZome : function(scene) {
        computeDDDZome(scene);
        computeWireframeLevels(scene);
        computeDDDWalls(scene);
      },

      removeZome : function(scene) {
        removeZome(scene);
        removeWalls(scene);
      },

      getViewBuilder : function (zomeDef) {
        currentDisplayedZome = zomeDef;
        return {
          id : "ZOME_SHAPE_BUILDER",
          build : service.buildZome,
          destruct : service.removeZome
        };
      }
    };

    var currentDisplayedZome = null;
    var dddZomeFaceObjects = [], dddWallsObject = null;

    function computeDDDZome(scene) {
      removeZome(scene);

      for (var faceId = 0; faceId < currentDisplayedZome.rhombeList.length; faceId++) {
        var zomeGeom = new THREE.Geometry();
        addFace(currentDisplayedZome.rhombeList[faceId], 0, zomeGeom);
        assignUVs(zomeGeom);
        zomeGeom.computeFaceNormals();
        var zomeObject = new THREE.Mesh(zomeGeom, plainMaterial);
        zomeObject.levelId = currentDisplayedZome.rhombeList[faceId][0].id.levelId;
        dddZomeFaceObjects.push(zomeObject);
        scene.add(zomeObject);
      }
    }
    function removeZome(scene) {
      if (dddZomeFaceObjects.length > 0) {
        for (var i = 0; i < dddZomeFaceObjects.length; i++) scene.remove(dddZomeFaceObjects[i]);
        dddZomeFaceObjects = [];
      }
    }

    function computeDDDWalls(scene) {
      removeWalls(scene);
      if (currentDisplayedZome.wallsVisible &&
        currentDisplayedZome.wallPanels.missingWallParts.length > 0 &&
        currentDisplayedZome.wallPanels.rectanglePanels.length > 0) {

        var wallGeom = new THREE.Geometry();
        var panelId;
        for (panelId = 0; panelId < currentDisplayedZome.wallPanels.rectanglePanels.length; panelId++) {
          addFace(currentDisplayedZome.wallPanels.rectanglePanels[panelId], panelId, wallGeom);
        }
        for (panelId = 0; panelId < currentDisplayedZome.wallPanels.missingWallParts.length; panelId++) {
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][1]));
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][0]));
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][2]));
          var id = currentDisplayedZome.wallPanels.rectanglePanels.length * 4 + panelId * 3;
          wallGeom.faces.push(new THREE.Face3(id + 0, id + 1, id + 2));
        }
        assignUVs(wallGeom);
        wallGeom.computeFaceNormals();
        dddWallsObject = new THREE.Mesh(wallGeom, plainMaterial);
        scene.add(dddWallsObject);

      }
    }



    function computeWireframeLevels(scene) {
      if (currentDisplayedZome.wireframeVisible && currentDisplayedZome.levelId > -1) {
        for (var i = 0; i < dddZomeFaceObjects.length; i++) {
          if (dddZomeFaceObjects[i].levelId < currentDisplayedZome.levelId) {
            dddZomeFaceObjects[i].material = (currentDisplayedZome.hideWireframe ? invisibleMaterial : edgeMaterial);
          } else {
            dddZomeFaceObjects[i].material =  plainMaterial;
          }
        }
      }
    }

    function removeWalls(scene) {
      if (dddWallsObject !== null) {
        scene.remove(dddWallsObject);
        dddWallsObject = null;
      }
    }

    function createVector(point) {
      var dddpoint = new THREE.Vector3(point.x, point.y, point.z);
      dddpoint.zomePointId = point.id;
      return dddpoint;
    }

    function addFace(face, id, geom) {
      geom.vertices.push(createVector(face[0]));
      geom.vertices.push(createVector(face[1]));
      geom.vertices.push(createVector(face[2]));
      geom.vertices.push(createVector(face[3]));
      geom.faces.push(new THREE.Face3(4 * id + 0, 4 * id + 1, 4 * id + 2));
      geom.faces.push(new THREE.Face3(4 * id + 2, 4 * id + 1, 4 * id + 3));
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

    var plainMaterial = new THREE.MeshPhongMaterial(
          {
            //color: 0x11DD11,
            map : THREE.ImageUtils.loadTexture('img/woodTexture.jpg'),
            side: THREE.DoubleSide
          });
    var edgeMaterial = new THREE.MeshBasicMaterial(
      {
        color : 0x555555,
        wireframe : true
      });
    var invisibleMaterial = new THREE.MeshBasicMaterial(
      {
        transparent : true,
        opacity : 0
      });

    return function() { return service; };
  });
