(function(){
  const stats = initStats();
  const init = ()=>{
    const renderer = initRenderer();
    const camera = initCamera();
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
    scene.add(lightHelper);

    const shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(shadowHelper);

    // 光源位置的小点点
    const sphereLightGeometry = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
    scene.add(sphereLightMesh);



    // 添加场景中对象
    addHouseAndTree(scene);

    // 控制元素
    const controls = new function () {
      this.intensity = ambientLight.intensity;
      this.ambientColor = ambientLight.color.getStyle();
      this.disableSpotlight = false;
    };

    const gui = new dat.GUI();
    gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function () {
      ambientLight.intensity = controls.intensity;
    });
    gui.addColor(controls, 'ambientColor').onChange(function () {
      console.log(controls.ambientColor);
      ambientLight.color = new THREE.Color(controls.ambientColor);
    });
    gui.add(controls, 'disableSpotlight').onChange(function (e) {
      spotLight.visible = !e;
    });

    const render = ()=>{
      stats.update();
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