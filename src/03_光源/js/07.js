class ThreeCase {
  constructor(){
    this.stats = initStats();
    this.renderer = initRenderer({antialias: true});
    this.camera = initCamera();
    this.scene = new THREE.Scene();
    this.trackballControls = initTrackballControls(this.camera, this.renderer);
    this.clock = new THREE.Clock();
    this.init();
  }
  init(){
    this.initObject();
    this.initLight();
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
    const cubeAndSphere = addDefaultCubeAndSphere(this.scene);
    const cube = cubeAndSphere.cube;
    cube.geometry.faces.forEach(function (face) {
      face.color.copy(new THREE.Color(Math.random() * 0xffffff));
    });
    cube.geometry.colorsNeedUpdate = true;
    const sphere = cubeAndSphere.sphere;
    // const plane = addGroundPlane(scene);

  }
  initLight(){


    // 一点点光
    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.intensity = 0.1;
    spotLight0.lookAt(this.plane);
    this.scene.add(spotLight0);

    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(30, 10, -50);
    spotLight.castShadow = true;
    spotLight.target = this.plane;
    spotLight.distance = 0;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.left = -100;
    spotLight.shadow.camera.right = 100;
    spotLight.shadow.camera.top = 100;
    spotLight.shadow.camera.bottom = -100;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.scene.add(spotLight);

  }
  initGUIControls(){
    // const controls = {
    //   color1:this.areaLight1.color.getHex(),
    //   intensity1:this.areaLight1.intensity,
    //   color2:this.areaLight2.color.getHex(),
    //   intensity2:this.areaLight2.intensity,
    //   color3:this.areaLight3.color.getHex(),
    //   intensity3:this.areaLight3.intensity,
    // };
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