(function(){
  const stats = initStats ();
  const init = ()=>{
    // 创建场景
    const scene = new THREE.Scene();

    // 创建摄相机
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,0.1, 1000);
    // 渲染场景的时候，Camera对象会自动地被添加进来，但是我们手动添加它会是一个更好的选择，尤其是当你需要处理多个摄像机的时候。
    // scene.add(camera);
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true  // 是否执行抗锯齿。默认为false
    });
    // 设置场景背景色
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;


    //  在场景中显示坐标轴
    // const axes = new THREE.AxesHelper(20);
    // scene.add(axes);

    // 创建平面几何体
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // 接收阴影
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    // 添加光源--聚光灯
    /*
    color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)。
    intensity - (可选参数) 光照强度。 缺省值 1。
    distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减。
    angle - 光线散射角度，最大为Math.PI/2。
    penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
    decay - 沿着光照距离的衰减量。
    */
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1.2, 150, Math.PI*0.5); // 这个120是不是搞错了
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true; // 定义能够产生阴影的光源
    scene.add(spotLight);

    // 添加光源--环境光
    const ambienLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambienLight);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);
    document.getElementById('webgl-frame').append(renderer.domElement);

    const controls = new function () {
      this.rotationSpeed = 0.02;
      this.numberOfObjects = scene.children.length;
      this.removeCube = function () {
          const allChildren = scene.children;
          const lastObject = allChildren[allChildren.length - 1];
          if (lastObject instanceof THREE.Mesh) {
              scene.remove(lastObject);
              this.numberOfObjects = scene.children.length;
          }
      };

      this.addCube = function () {
          const cubeSize = Math.ceil((Math.random() * 3));
          const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const cubeMaterial = new THREE.MeshLambertMaterial({
              color: Math.random() * 0xffffff
          });
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.castShadow = true;
          cube.name = "cube-" + scene.children.length;
          // position the cube randomly in the scene
          cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
          cube.position.y = Math.round((Math.random() * 5));
          cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

          // add the cube to the scene
          scene.add(cube);
          this.numberOfObjects = scene.children.length;
      };

      this.outputObjects = function () {
          // console.log(scene.children);
      };
    };

    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    // attach them here, since appendChild needs to be called first
    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    // eslint-disable-next-line no-unused-consts
    const render = () => {
      trackballControls.update(clock.getDelta());
      stats.update();

      // rotate the cubes around its axes
      scene.traverse(function (e) {
        if (e instanceof THREE.Mesh && e != plane) {
            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
        }
      });

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