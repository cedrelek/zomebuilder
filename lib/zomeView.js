angular.module('ZomeViewModule', ['ZomeDefinitionModule'])

  .controller('ZomeViewController', ['zomeDefinitionService', 'zomeCalculatorService', function(zomeDef, calculator) {
    this.baseAngle = zomeDef().baseAngle;
    this.levelHeight = zomeDef().levelHeight;
    this.orderNumber = zomeDef().orderNumber;
    this.rhombeList = zomeDef().rhombeList;
    this.pointList = zomeDef().pointList
    var rhombeList = [];
    this.updateZome = function() {
      var pointList = calculator().computePointList(this.orderNumber, this.levelHeight, this.baseAngle);
      rhombeList = calculator().buildRhombeList(this.orderNumber, pointList);
      updateObject();
      render();
    }
    this.rebuildZome = function() {
      var pointList = calculator().computePointList(this.orderNumber, this.levelHeight, this.baseAngle);
      rhombeList = calculator().buildRhombeList(this.orderNumber, pointList);
      updateObject();
      render();
    }
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    var scene;
    var stats;
    var material = new THREE.MeshLambertMaterial(
          {
            color: 0xDDDDDD
          });
    var zomeObject = null;
    var container;
    var renderer;
    var WIDTH = 800;
    var HEIGHT = 800;
    var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;

    function updateObject() {
      if (zomeObject != null) {
        scene.remove(zomeObject);
      }
      var geom = new THREE.Geometry();

      for (var faceId = 0; faceId < rhombeList.length; faceId++) {
        addFace(rhombeList[faceId], faceId, geom);
      }
      geom.computeFaceNormals();
      zomeObject = new THREE.Mesh(geom, material);
      scene.add(zomeObject);
    }

    function addFace(face, id, geom) {

      geom.vertices.push(createVector(face[0]));
      geom.vertices.push(createVector(face[1]));
      geom.vertices.push(createVector(face[2]));
      geom.vertices.push(createVector(face[3]));
      geom.faces.push(new THREE.Face3(id * 4, id * 4 + 1, id * 4 + 2));
      geom.faces.push(new THREE.Face3(id * 4, id * 4 + 2, id * 4 + 1));
      geom.faces.push(new THREE.Face3(id * 4 + 2, id * 4 + 1, id * 4 + 3));
      geom.faces.push(new THREE.Face3(id * 4 + 2, id * 4 + 3, id * 4 + 1));
    }

    function createVector(point) {
      return new THREE.Vector3(point.x, point.y, point.z);
    }

    function render() {

      renderer.render(scene, camera);
      stats.update();
    }
    function animate() {

        requestAnimationFrame(animate);
        controls.update();

    }

    function init() {
      camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR);
      camera.position.set(0,0,1000);
      camera.up = new THREE.Vector3(0,1,0);
      camera.lookAt(new THREE.Vector3(0, 250, 0));

      controls = new THREE.OrbitControls( camera );
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
      container.append( stats.domElement );

      container.append(renderer.domElement);


      animate();
    }

    init();
    render();

  }]);
