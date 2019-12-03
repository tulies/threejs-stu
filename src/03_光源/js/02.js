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

    // 添加聚光灯以获得一点光线
    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    // add target and light
    const target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);


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