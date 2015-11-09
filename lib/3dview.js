angular.module("3DViewModule", [])
  .factory("3DService", function() {
    var service = {
      init : function() {
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);
        camera.position.set(0,0,1000);
        camera.up = new THREE.Vector3(0,1,0);
        camera.lookAt(new THREE.Vector3(0, 250, 0));

        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', service.render );

        scene = new THREE.Scene();
        container = $('#zomeView');
        renderer = new THREE.WebGLRenderer();

        renderer.setSize(WIDTH, HEIGHT);

        var pointLight = new THREE.PointLight(0x0000FF);
        pointLight.position.x = 900;
        pointLight.position.y = 250;
        pointLight.position.z = 0;

        var pointLight2 = new THREE.PointLight(0x0000FF);
        pointLight2.position.x = 0;
        pointLight2.position.y = 250;
        pointLight2.position.z = 900;
        var pointLight3 = new THREE.PointLight(0xAAAAAA);
        pointLight3.position.x = -900;
        pointLight3.position.y = 250;
        pointLight3.position.z = 0;
        var pointLight4 = new THREE.PointLight(0xAAAAAA);
        pointLight4.position.x = 0;
        pointLight4.position.y = 250;
        pointLight4.position.z = -900;
        scene.add(pointLight);
        scene.add(pointLight2);
        scene.add(pointLight3);
        scene.add(pointLight4);
        scene.add(camera);
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.append(stats.domElement);
        container.append(renderer.domElement);

        animate();
      },
      hideLevel : function(levelId) {
        for (var i = 0; i < zomeObjects.length; i++) {
          if (zomeObjects[i].levelId < levelId) {
            zomeObjects[i].material = edgeMaterial;
          } else {
            zomeObjects[i].material = plainMaterial;
          }
        }
        service.render();
      },
      updateZomeObject : function(rhombeList, oldRhombeList) {

        if (zomeObjects.length > 0) {
          for (var i = 0; i < zomeObjects.length; i++) scene.remove(zomeObjects[i]);
          zomeObjects = [];
        }

        for (var faceId = 0; faceId < rhombeList.length; faceId++) {
          var zomeGeom = new THREE.Geometry();
          addFace(rhombeList[faceId], 0, zomeGeom);
          zomeGeom.computeFaceNormals();
          var zomeObject = new THREE.Mesh(zomeGeom, plainMaterial);
          zomeObject.levelId = rhombeList[faceId][0].id.levelId;
          zomeObjects.push(zomeObject);
          scene.add(zomeObject);
        }
        service.render();

      },
      showWalls : function(wallPanels) {
        service.hideWalls();
        var wallGeom = new THREE.Geometry();
        for (var panelId = 0; panelId < wallPanels.rectanglePanels.length; panelId++) {
          addFace(wallPanels.rectanglePanels[panelId], panelId, wallGeom);
        }
        for (var panelId = 0; panelId < wallPanels.missingWallParts.length; panelId++) {
          wallGeom.vertices.push(createVector(wallPanels.missingWallParts[panelId][1]));
          wallGeom.vertices.push(createVector(wallPanels.missingWallParts[panelId][0]));
          wallGeom.vertices.push(createVector(wallPanels.missingWallParts[panelId][2]));
          var id = wallPanels.rectanglePanels.length * 4 + panelId * 3;
          wallGeom.faces.push(new THREE.Face3(id + 0, id + 1, id + 2));
          wallGeom.faces.push(new THREE.Face3(id + 0, id + 2, id + 1));
        }
        wallGeom.computeFaceNormals();
        wallObject = new THREE.Mesh(wallGeom, plainMaterial);
        scene.add(wallObject);
        service.render();
      },
      hideWalls : function() {
        if (wallObject != null) {
          scene.remove(wallObject);
          wallObject = null;
        }
      },

      render : function () {

        renderer.render(scene, camera);
        stats.update();
      }

    };

    function animate() {

        requestAnimationFrame(animate);
        controls.update();

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
      geom.faces.push(new THREE.Face3(4 * id + 0, 4 * id + 2, 4 * id + 1));
      geom.faces.push(new THREE.Face3(4 * id + 2, 4 * id + 1, 4 * id + 3));
      geom.faces.push(new THREE.Face3(4 * id + 2, 4 * id + 3, 4 * id + 1));
    }

    var scene;
    var stats;
    var zomeGeoms = [];
    var wallObject = null;
    var plainMaterial = new THREE.MeshLambertMaterial(
          {
            color: 0xDDDDDD
          });
    var edgeMaterial = new THREE.MeshBasicMaterial(
      {
        color : 0x555555,
        wireframe : true
      }
    )
    var zomeObjects = [];
    var container;
    var renderer;
    var WIDTH = 800;
    var HEIGHT = 800;
    var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;
    return function() { return service; }
  })
