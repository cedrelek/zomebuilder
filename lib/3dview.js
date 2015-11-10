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

        controls = new THREE.OrbitControls( camera,  document.getElementById('zomeView'));
        controls.addEventListener( 'change', render );

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
      updateZome : function(zomeDef) {
        currentDisplayedZome = zomeDef;
        computeDDDZome();
        computeWireframeLevels();
        computeDDDWalls();
        render();
      }

    };

    var WIDTH = 800;
    var HEIGHT = 800;
    var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;
    var currentDisplayedZome = null;
    var dddZomeFaceObjects = [], dddWallsObject = null;
    var scene;
    var stats;
    var plainMaterial = new THREE.MeshLambertMaterial(
          {
            color: 0xDDDDDD,
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
    var container;
    var renderer;

    function computeDDDZome() {
      if (dddZomeFaceObjects.length > 0) {
        for (var i = 0; i < dddZomeFaceObjects.length; i++) scene.remove(dddZomeFaceObjects[i]);
        dddZomeFaceObjects = [];
      }

      for (var faceId = 0; faceId < currentDisplayedZome.rhombeList.length; faceId++) {
        var zomeGeom = new THREE.Geometry();
        addFace(currentDisplayedZome.rhombeList[faceId], 0, zomeGeom);
        zomeGeom.computeFaceNormals();
        var zomeObject = new THREE.Mesh(zomeGeom, plainMaterial);
        zomeObject.levelId = currentDisplayedZome.rhombeList[faceId][0].id.levelId;
        dddZomeFaceObjects.push(zomeObject);
        scene.add(zomeObject);
      }
    }

    function computeDDDWalls() {
      hideWalls();
      if (currentDisplayedZome.wallsVisible
        && currentDisplayedZome.wallPanels.missingWallParts.length > 0
        && currentDisplayedZome.wallPanels.rectanglePanels.length > 0) {

        var wallGeom = new THREE.Geometry();
        for (var panelId = 0; panelId < currentDisplayedZome.wallPanels.rectanglePanels.length; panelId++) {
          addFace(currentDisplayedZome.wallPanels.rectanglePanels[panelId], panelId, wallGeom);
        }
        for (var panelId = 0; panelId < currentDisplayedZome.wallPanels.missingWallParts.length; panelId++) {
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][1]));
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][0]));
          wallGeom.vertices.push(createVector(currentDisplayedZome.wallPanels.missingWallParts[panelId][2]));
          var id = currentDisplayedZome.wallPanels.rectanglePanels.length * 4 + panelId * 3;
          wallGeom.faces.push(new THREE.Face3(id + 0, id + 1, id + 2));
          //wallGeom.faces.push(new THREE.Face3(id + 0, id + 2, id + 1));
        }
        wallGeom.computeFaceNormals();
        dddWallsObject = new THREE.Mesh(wallGeom, plainMaterial);
        scene.add(dddWallsObject);

      }
    }


    function hideWalls() {
      if (dddWallsObject != null) {
        scene.remove(dddWallsObject);
        dddWallsObject = null;
      }
    }

    function computeWireframeLevels() {
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

    function render () {

      renderer.render(scene, camera);
      stats.update();
    }

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
      //geom.faces.push(new THREE.Face3(4 * id + 0, 4 * id + 2, 4 * id + 1));
      geom.faces.push(new THREE.Face3(4 * id + 2, 4 * id + 1, 4 * id + 3));
      //geom.faces.push(new THREE.Face3(4 * id + 2, 4 * id + 3, 4 * id + 1));
    }


    return function() { return service; }
  })
