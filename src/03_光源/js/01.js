(function(){
  const stats = initStats();
  const init = ()=>{
    const renderer = initRenderer();
    const camera = initCamera();
    const scene = new THREE.Scene();

    // 环境光
    // color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
    // intensity - (参数可选)光照的强度。缺省值为 1。
    const ambientLight = new THREE.AmbientLight(0x606008, 1);
    scene.add(ambientLight);

    // 环境光需配合其他光源一起使用才能起效果，
    // 添加一个其他光，
    const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI/4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-30, 40, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    // 添加场景中对象
    addHouseAndTree(scene);
    console.log(ambientLight.color.getStyle());

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