(function(){
  const stats = initStats();
  const init = ()=>{
    const renderer = initRenderer();
    const camera = initCamera();
    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();

    // 环境光
    // color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
    // intensity - (参数可选)光照的强度。缺省值为 1。
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // 环境光需配合其他光源一起使用才能起效果，
    // 添加一个其他光，
    const pointLight = new THREE.PointLight(0xccffcc, 1, 0);
    pointLight.decay = 0.1;
    pointLight.castShadow = true;
    pointLight.position.set(25, 5, 10);
    scene.add(pointLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper);

    const shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    // scene.add(shadowHelper);

    // 光源位置的小点点
    const sphereLightGeometry = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    // sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
    sphereLightMesh.position.set(25, 5, 10);
    scene.add(sphereLightMesh);


    // 添加场景中对象
    addHouseAndTree(scene);

    // 控制元素
    let invert = 1;
    let phase = 0;
    const setupControls = () => {
      var controls = new function () {
        this.rotationSpeed = 0.01;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambientLight.color.getStyle();
        this.pointColor = pointLight.color.getStyle();
        this.intensity = 1;
        this.distance = pointLight.distance;
        this.showLightHelper = false;
        this.showShadowHelper = false;
      };

      var gui = new dat.GUI();
      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
      });

      gui.addColor(controls, 'pointColor').onChange(function (e) {
        pointLight.color = new THREE.Color(e);
      });

      gui.add(controls, 'distance', 0, 100).onChange(function (e) {
        pointLight.distance = e;
      });

      gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
        pointLight.intensity = e;
      });

      gui.add(controls, 'showLightHelper').onChange(function (e) {
        if (e) {
          scene.add(lightHelper);
        } else {
          scene.remove(lightHelper);
        }
      });

      gui.add(controls, 'showShadowHelper').onChange(function (e) {
        if (e) {
          scene.add(shadowHelper);
        } else {
          scene.remove(shadowHelper);
        }
      });

      return controls;
    };
    const controls = setupControls();

    const render = ()=>{
      lightHelper.update();
      shadowHelper.update();

      stats.update();
      pointLight.position.copy(sphereLightMesh.position);

      // move the light simulation
      if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
      } else {
        phase += controls.rotationSpeed;
      }
      sphereLightMesh.position.z = +(25 * (Math.sin(phase)));
      sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
      sphereLightMesh.position.y = 5;

      if (invert < 0) {
        var pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
      }

      trackballControls.update(clock.getDelta());
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