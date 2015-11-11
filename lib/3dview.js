angular.module("3DViewModule", [])
  .factory("3DService", function() {
    var service = {
      init : function() {
        initView('zomeView');
      },

      updateView : function(viewBuilder) {
        if (currentViewBuilder !== null && currentViewBuilder.id != viewBuilder.id) {
          currentViewBuilder.destruct(scene);
          render();
        }
        currentViewBuilder = viewBuilder;
        currentViewBuilder.build(scene);
        render();
      },



    };


    var WIDTH = 800;
    var HEIGHT = 800;
    var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;
    var currentViewBuilder = null;
    var scene;
    var stats;

    var container;
    var renderer;

    function render () {

      renderer.render(scene, camera);
      stats.update();
    }

    function animate() {

        requestAnimationFrame(animate);
        controls.update();

    }

    function initView(domElementId) {
      if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR);
      camera.position.set(0,0,1000);
      camera.up = new THREE.Vector3(0,1,0);
      camera.lookAt(new THREE.Vector3(0, 250, 0));

      controls = new THREE.OrbitControls( camera,  document.getElementById(domElementId));
      controls.addEventListener( 'change', render );

      scene = new THREE.Scene();
      container = $('#' + domElementId);
      renderer = new THREE.WebGLRenderer();

      renderer.setSize(WIDTH, HEIGHT);

      var pointLight = new THREE.PointLight(0xDDDDDD);
      pointLight.position.x = 900;
      pointLight.position.y = 250;
      pointLight.position.z = 0;

      var pointLight2 = new THREE.PointLight(0x555555);
      pointLight2.position.x = 0;
      pointLight2.position.y = 250;
      pointLight2.position.z = 900;
      var pointLight3 = new THREE.PointLight(0xDDDDDDD);
      pointLight3.position.x = -900;
      pointLight3.position.y = 250;
      pointLight3.position.z = 0;
      var pointLight4 = new THREE.PointLight(0x555555);
      pointLight4.position.x = 0;
      pointLight4.position.y = 250;
      pointLight4.position.z = -900;
      scene.add(pointLight);
      scene.add(pointLight2);
      scene.add(pointLight3);
      scene.add(pointLight4);
      /*var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight.position.set( 1, 1, 0 );
      scene.add( directionalLight );
      var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight2.position.set( -1, 1, 0 );
      scene.add( directionalLight2 );*/
      scene.add(camera);
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      stats.domElement.style.zIndex = 100;
      container.append(stats.domElement);
      container.append(renderer.domElement);

      animate();
    }

    return function() { return service; };
  });
