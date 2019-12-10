(function(){
  const stats = initStats();
  const init = ()=>{
    const renderer = initRenderer();
    const camera = initCamera();
    const scene = new THREE.Scene();


    // 添加场景中对象
    const cubeAndSphere = addDefaultCubeAndSphere(scene);
    const cube = cubeAndSphere.cube;
    const sphere = cubeAndSphere.sphere;
    const plane = addGroundPlane(scene);



    // 添加微妙的环境光
    const ambientLight = new THREE.AmbientLight(0x1c1c1c);
    scene.add(ambientLight);

    // 添加聚光灯以获得一点光线, 有点类似环境光效果
    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    // add target and light
    const target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 30, -10);
    // 指向目标
    spotLight.target = plane;
    // 衰减
    spotLight.distance = 0;
    // 角度，光源发射出的光束的宽度，单位是弧度，默认值未Math.PI/3
    spotLight.angle = 0.4;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 120;
    scene.add(spotLight);

    // 开启调试聚光灯光源
    const pp = new THREE.SpotLightHelper(spotLight);
    scene.add(pp);
    // 开启阴影调试
    const debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);
    // scene.add(debugCamera);


    // 光源位置的小点点
    const sphereLightGeometry = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    // sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
    sphereLightMesh.position.set(3, 20, 3);

    scene.add(sphereLightMesh);


    // 控制元素
    // for controlling the rendering
    var step = 0;
    var invert = 1;
    var phase = 0;

    const setupControls = ()=> {
      var controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambientLight.color.getStyle();
        this.pointColor = spotLight.color.getStyle();
        this.intensity = 1;
        this.distance = 0;
        this.angle = 0.1;
        this.shadowDebug = false;
        this.castShadow = true;
        this.target = "Plane";
        this.stopMovingLight = false;
        this.penumbra = 0;
      };

      var gui = new dat.GUI();
      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
      });

      gui.addColor(controls, 'pointColor').onChange(function (e) {
        spotLight.color = new THREE.Color(e);
      });

      gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
        spotLight.angle = e;
      });

      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        spotLight.intensity = e;
      });

      gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
        spotLight.penumbra = e;
      });

      gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        spotLight.distance = e;
      });

      gui.add(controls, 'shadowDebug').onChange(function (e) {
        if (e) {
          scene.add(debugCamera);
        } else {
          scene.remove(debugCamera);
        }
      });

      gui.add(controls, 'castShadow').onChange(function (e) {
        spotLight.castShadow = e;
      });

      gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        switch (e) {
          case "Plane":
            spotLight.target = plane;
            break;
          case "Sphere":
            spotLight.target = sphere;
            break;
          case "Cube":
            spotLight.target = cube;
            break;
        }

      });

      gui.add(controls, 'stopMovingLight').onChange(function (e) {
        stopMovingLight = e;
      });

      return controls;
    };
    const controls = setupControls();

    const render = ()=>{
      stats.update();

        // rotate the cube around its axes
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      // bounce the sphere up and down
      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      // move the light simulation
      if (!controls.stopMovingLight) {
        if (phase > 2 * Math.PI) {
          invert = invert * -1;
          phase -= 2 * Math.PI;
        } else {
          phase += controls.rotationSpeed;
        }
        sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 15;

        if (invert < 0) {
          var pivot = 14;
          sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

        spotLight.position.copy(sphereLightMesh.position);
      }

      pp.update();

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    const onResize = () =>{
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, false);
  };

  init();
})();