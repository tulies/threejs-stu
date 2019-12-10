(function () {
  const stats = initStats();
  const init = () => {
    const renderer = initRenderer();
    const camera = initCamera();
    camera.position.set(-80, 80, 80);

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();

    // 环境光
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // 环境光需配合其他光源一起使用才能起效果，
    // 添加一个其他光，
    const directionalLight = new THREE.DirectionalLight(0xFF5808);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 80;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;

    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(lightHelper);

    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowHelper);

    // 光源位置的小点点
    const sphereLightGeometry = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25
    });
    const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    // sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
    sphereLightMesh.position.set(15, -5, 0);
    scene.add(sphereLightMesh);


    // 添加场景中对象
    const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.set(15, -5, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);


    const cubeAndSphere = addDefaultCubeAndSphere(scene);
    const cube = cubeAndSphere.cube;
    const sphere = cubeAndSphere.sphere;
    // const plane = addGroundPlane(scene);

    // 控制元素
    let step = 0;
    const setupControls = () => {
      var controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambientLight.color.getStyle();
        this.directionalColor = directionalLight.color.getStyle();
        this.intensity = 0.5;
        this.showLightHelper = true;
        this.showShadowHelper = false;
        this.castShadow = true;
        this.target = "Plane";
      };

      var gui = new dat.GUI();

      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
      });

      gui.addColor(controls, 'directionalColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e);
      });

      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        directionalLight.intensity = e;
      });
      gui.add(controls, 'showLightHelper').onChange(function (e) {
        e ? scene.add(lightHelper) : scene.remove(lightHelper);
      });
      gui.add(controls, 'showShadowHelper').onChange(function (e) {
        e ? scene.add(shadowHelper) : scene.remove(shadowHelper);
      });

      gui.add(controls, 'castShadow').onChange(function (e) {
        directionalLight.castShadow = e;
      });



      gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        console.log(e);
        switch (e) {
          case "Plane":
            directionalLight.target = plane;
            break;
          case "Sphere":
            directionalLight.target = sphere;
            break;
          case "Cube":
            directionalLight.target = cube;
            break;
        }

      });
      return controls;
    };
    const controls = setupControls();

    const render = () => {
      stats.update();
      trackballControls.update(clock.getDelta());

      lightHelper.update();
      shadowHelper.update();

      // rotate the cube around its axes
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      // bounce the sphere up and down
      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      sphereLightMesh.position.z = -8;
      sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
      sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

      directionalLight.position.copy(sphereLightMesh.position);


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