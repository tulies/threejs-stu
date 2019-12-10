class ThreeCase {
  constructor(){
    this.step = 0;
    this.stats = initStats();
    this.renderer = initRenderer({
      alpha: true
    });
    this.camera = initCamera();
    this.camera.position.set(-20, 10, 45);
    this.camera.lookAt(new THREE.Vector3(10, 0, 0));
    this.scene = new THREE.Scene();
    this.trackballControls = initTrackballControls(this.camera, this.renderer);
    this.clock = new THREE.Clock();
    this.init();
  }
  init(){
    this.initObject();
    this.initLight();
    this.initLensFlare();
    this.initGUIControls();
  }
  initObject(){

    const textureGrass = new THREE.TextureLoader().load('../../assets/textures/ground/grasslight-big.jpg');
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10,10);

    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      // color: 0xFFFFFF
      map: textureGrass
    });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.receiveShadow = true;
    this.plane.position.set(15, 0, 0);
    this.plane.rotation.x = -0.5 * Math.PI;
    this.scene.add(this.plane);

    // 添加2个几何体
    this.cubeAndSphere = addDefaultCubeAndSphere(this.scene);
    // const cube = cubeAndSphere.cube;
    this.cubeAndSphere.cube.geometry.faces.forEach(function (face) {
      face.color.copy(new THREE.Color(Math.random() * 0xffffff));
    });
    this.cubeAndSphere.cube.geometry.colorsNeedUpdate = true;
    // const sphere = cubeAndSphere.sphere;
    // const plane = addGroundPlane(scene);

  }
  initLight(){

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    this.scene.add(ambientLight);


    this.spotLight = new THREE.SpotLight(0xcccccc);
    this.spotLight.position.set(-40, 60, -10);
    this.spotLight.lookAt(this.plane);
    this.scene.add(this.spotLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.directionalLight.position.set(30, 10, -50);
    // this.directionalLight.intensity =5;
    this.directionalLight.castShadow = true;
    this.directionalLight.target = this.plane;
    this.directionalLight.distance = 0;
    this.directionalLight.shadow.camera.near = 2;
    this.directionalLight.shadow.camera.far = 200;
    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);

    // const lightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
    // this.scene.add(lightHelper);

  }
  initLensFlare(){
    const textureFlare0 = new THREE.TextureLoader().load('../../assets/textures/flares/lensflare0.png');
    const textureFlare3 = new THREE.TextureLoader().load("../../assets/textures/flares/lensflare3.png");

    // const textureFlare3 = THREE.ImageUtils.loadTexture("../../assets/textures/flares/lensflare3.png");

    const flareColor = new THREE.Color(0xffaacc);

    // const lensflare = new THREE.Lensflare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);
    // lensflare.position.copy(this.directionalLight.position);
    // this.directionalLight.add(lensflare);
    // this.directionalLight.add(lensflare);

    const lensFlare = new THREE.Lensflare();
    lensFlare.addElement(new THREE.LensflareElement(textureFlare0, 350, 0.0, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1.0, flareColor));
    this.directionalLight.add(lensFlare);

  }
  initGUIControls(){
    this.controls = {
      rotationSpeed:0.03,
      bouncingSpeed:0.03,
    };
    // const gui = new dat.GUI();
    // gui.addColor(controls, 'color1').onChange(e=>{
    //   this.areaLight1.color = new THREE.Color(e);
    //   this.plane1.material.color.set(new THREE.Color(e));
    // });
    // gui.add(controls, 'intensity1', 0, 1000).onChange(e=>{
    //   this.areaLight1.intensity = e;
    // });
    // gui.addColor(controls, 'color2').onChange(e=>{
    //   this.areaLight2.color = new THREE.Color(e);
    //   this.plane2.material.color.set(new THREE.Color(e));
    // });
    // gui.add(controls, 'intensity2', 0, 1000).onChange(e=>{
    //   this.areaLight2.intensity = e;
    // });
    // gui.addColor(controls, 'color3').onChange(e=>{
    //   this.areaLight3.color = new THREE.Color(e);
    //   this.plane3.material.color.set(new THREE.Color(e));
    // });
    // gui.add(controls, 'intensity3', 0, 1000).onChange(e=>{
    //   this.areaLight3.intensity = e;
    // });

  }


  render(){
    this.stats.update();
    this.trackballControls.update();


    this.cubeAndSphere.cube.rotation.x += this.controls.rotationSpeed;
    this.cubeAndSphere.cube.rotation.y += this.controls.rotationSpeed;
    this.cubeAndSphere.cube.rotation.z += this.controls.rotationSpeed;

    // bounce the sphere up and down
    this.step += this.controls.bouncingSpeed;
    this.cubeAndSphere.sphere.position.x = 20 + (10 * (Math.cos(this.step)));
    this.cubeAndSphere.sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.step)));



    requestAnimationFrame(()=>{
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }
}

(function(){
  const threeCase = new ThreeCase();
  threeCase.render();
})();