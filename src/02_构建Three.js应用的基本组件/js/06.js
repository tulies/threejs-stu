(function(){
  const stats = initStats();

  const init = ()=>{
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 平面几何体
    const planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);



    // 立方体
    const geometry = new THREE.BoxGeometry(5, 8, 3);
    const material = new THREE.MeshLambertMaterial({color: 0x44ff44});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 4;
    mesh.castShadow = true;
    scene.add(mesh);

    // 设置相机位置
    camera.position.set(-60, 40, 30);
    camera.lookAt(mesh.position);

    //设置光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    // 聚光灯
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1, 180, Math.PI/4);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.position.set(-40,30,30);
    spotLight.lookAt(mesh);
    spotLight.castShadow = true;
    scene.add(spotLight);

    console.log(mesh);

    const controls = {
      positionX:1,
      positionY:1,
      positionZ:1,
      scaleX:1,
      scaleY:1,
      scaleZ:1,
      rotationX:0,
      rotationY:0,
      rotationZ:0,
      translateX:0,
      translateY:0,
      translateZ:0,
    };
    const gui = new dat.GUI();
    guiPosition = gui.addFolder('position');
    guiPosition.add(controls,'positionX',-10,10);
    guiPosition.add(controls,'positionY',-10,10);
    guiPosition.add(controls,'positionZ',-10,10);

    guiScale = gui.addFolder('scale');
    guiScale.add(controls,'scaleX',0,5);
    guiScale.add(controls,'scaleY',0,5);
    guiScale.add(controls,'scaleZ',0,5);

    guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls,'rotationX',0,4);
    guiRotation.add(controls,'rotationY',0,4);
    guiRotation.add(controls,'rotationZ',0,4);

    guiTranslate = gui.addFolder('translate');
    guiTranslate.add(controls,'translateX',-10,10);
    guiTranslate.add(controls,'translateY',-10,10);
    guiTranslate.add(controls,'translateZ',-10,10);

    document.getElementById('webgl-frame').append(renderer.domElement);

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    const render = function(){
      trackballControls.update(clock.getDelta());
      stats.update();

      // 这边写控制逻辑

      mesh.position.set(controls.positionX, controls.positionY, controls.positionZ);

      mesh.translateX(controls.translateX);
      mesh.translateY(controls.translateY);
      mesh.translateZ(controls.translateZ);
      mesh.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
      mesh.rotation.set(controls.rotationX, controls.rotationY, controls.rotationZ);
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