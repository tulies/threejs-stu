(function(){
  const stats = initStats();

  const init = ()=>{
    const scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 平面几何体
    const planeGeometry = new THREE.PlaneGeometry(180, 180);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);


    // 立方体
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    for(var i = 0; i < (planeGeometry.parameters.width / 5); i++){
      for(var j = 0; j < (planeGeometry.parameters.width / 5); j++){
        const rnd = Math.random() * 0.75 + 0.25;
        const cubeMaterial = new THREE.MeshLambertMaterial();
        cubeMaterial.color = new THREE.Color(rnd, 0, 0);
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-(planeGeometry.parameters.width/2)+2+(i*5), 2, -(planeGeometry.parameters.height/2)+2+(j*5));

        scene.add(cube);
      }
    }

    // 设置相机位置
    camera.position.set(120, 60, 180);
    camera.lookAt(scene.position);

    //设置光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);
    // 平行光
    const directLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
    directLight.position.set(-20, 40, 60);
    scene.add(directLight);

    document.getElementById('webgl-frame').append(renderer.domElement);

    let trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();


    const controls = {
      camera: 'Perspective',
      switchCamera: function(){
        if(camera instanceof THREE.PerspectiveCamera){
          // 正投影相机
          camera = new THREE.OrthographicCamera(window.innerWidth/-16, window.innerWidth/16, window.innerHeight/16,window.innerHeight/-16, -200, 500);
          this.camera = 'Orthographic';

        }else{
          // 透视相机
          camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
          this.camera = 'Perspective';

        }
        camera.position.set(120, 60, 180);
        camera.lookAt(scene.position);
        trackballControls = initTrackballControls(camera, renderer);
      }
    };
    const gui = new dat.GUI();
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'camera').listen();


    const render = function(){
      trackballControls.update(clock.getDelta());
      stats.update();

      // 这边写控制逻辑


      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    const onResize = () =>{
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render();
    window.addEventListener('resize', onResize, false);


  };

  init();

})();