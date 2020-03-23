(function () {
  const stats = initStats();
  const init = () => {
    const renderer = initRenderer();
    const camera = initCamera();

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();


    const textureGrass = new THREE.TextureLoader().load('../../assets/textures/ground/grasslight-big.jpg');
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10,10);

    // 添加场景中对象
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      // color: 0xFFFFFF
      map: textureGrass
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);


    const cubeAndSphere = addDefaultCubeAndSphere(scene);
    const cube = cubeAndSphere.cube;
    cube.geometry.faces.forEach(function (face) {
      face.color.copy(new THREE.Color(Math.random() * 0xffffff));
    });
    cube.geometry.colorsNeedUpdate = true;
    const sphere = cubeAndSphere.sphere;
    // const plane = addGroundPlane(scene);


    // 光源位置的小点点
    const sphereLightGeometry = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25
    });
    const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    // sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
    sphereLightMesh.position.set(15, -5, 0);
    scene.add(sphereLightMesh);


     // 环境光
    // const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // scene.add(ambientLight);
      // add spotlight for a bit of light
    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    // spotLight0.castShadow = true;

    scene.add(spotLight0);

    // 环境光需配合其他光源一起使用才能起效果，
    // 添加一个其他光，
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(30, 10, -50);
    directionalLight.target = plane;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);


    const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemisphereLight.position.set(0, 500, 0);
    scene.add(hemisphereLight);

    // const lightHelper = new THREE.HemisphereLightHelper(hemisphereLight);
    // scene.add(lightHelper);

    // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowHelper);


    // 控制元素
    // let step = 0;
    const setupControls = () => {
      var controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.hemisphere = true;
        this.color = 0x0000ff;
        this.groundColor = 0x00ff00;
        this.intensity = 0.6;

      };

      var gui = new dat.GUI();

      gui.add(controls, 'hemisphere').onChange(function (e) {

        if (!e) {
          hemisphereLight.intensity = 0;
        } else {
          hemisphereLight.intensity = controls.intensity;
        }
      });
      gui.addColor(controls, 'groundColor').onChange(function (e) {
        hemisphereLight.groundColor = new THREE.Color(e);
      });
      gui.addColor(controls, 'color').onChange(function (e) {
        hemisphereLight.color = new THREE.Color(e);
      });
      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        hemisphereLight.intensity = e;
      });

      return controls;
    };
    const controls = setupControls();
    // console.log(controls);

    let step = 0;
    const render = () => {
      stats.update();
      const delta = this.clock.getDelta();
      this.trackballControls.update(delta);
      // lightHelper.update();
      // shadowHelper.update();

      // rotate the cube around its axes
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      // bounce the sphere up and down
      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));


      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, false);
  };

  init();
})();