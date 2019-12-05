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
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    this.scene.add(plane);


    // 添加2个几何体
    const cubeAndSphere = addDefaultCubeAndSphere(scene);
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



    // 这个不知道干嘛用的，没看到起到啥作用
    THREE.RectAreaLightUniformsLib.init();

    this.areaLight1 = new THREE.RectAreaLight(0xff0000, 500, 4, 10);
    this.areaLight1.position.copy(this.plane1.position);
    this.areaLight1.lookAt(this.plane1.position.x, this.plane1.position.y, this.plane1.position.z+1);
    this.scene.add(this.areaLight1);

    // 这面这段是官方的demo写法
    // var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( {  color: 0xff0000 } ) );
    // rectLightMesh.scale.x = this.areaLight1.width;
    // rectLightMesh.scale.y = this.areaLight1.height;
    // this.areaLight1.add( rectLightMesh );
    // var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
    // rectLightMesh.add( rectLightMeshBack );


    // 新版本RectAreaLightHelper好像没啥作用，位置固定再原点。。
    // const rectLightHelper = new THREE.RectAreaLightHelper( this.areaLight1 );
    // this.scene.add(rectLightHelper);

    this.areaLight2 = new THREE.RectAreaLight(0x00ff00, 500, 4, 10);
    this.areaLight2.position.copy(this.plane2.position);
    this.areaLight2.lookAt(this.plane2.position.x, this.plane2.position.y, this.plane2.position.z+1);

    this.scene.add(this.areaLight2);

    this.areaLight3 = new THREE.RectAreaLight(0x0000ff, 500, 4, 10);
    this.areaLight3.position.copy(this.plane3.position);
    this.areaLight3.lookAt(this.plane3.position.x, this.plane3.position.y, this.plane3.position.z+1);
    this.scene.add(this.areaLight3);
  }
  initGUIControls(){
    const controls = {
      color1:this.areaLight1.color.getHex(),
      intensity1:this.areaLight1.intensity,
      color2:this.areaLight2.color.getHex(),
      intensity2:this.areaLight2.intensity,
      color3:this.areaLight3.color.getHex(),
      intensity3:this.areaLight3.intensity,
    };
    const gui = new dat.GUI();
    gui.addColor(controls, 'color1').onChange(e=>{
      this.areaLight1.color = new THREE.Color(e);
      this.plane1.material.color.set(new THREE.Color(e));
    });
    gui.add(controls, 'intensity1', 0, 1000).onChange(e=>{
      this.areaLight1.intensity = e;
    });
    gui.addColor(controls, 'color2').onChange(e=>{
      this.areaLight2.color = new THREE.Color(e);
      this.plane2.material.color.set(new THREE.Color(e));
    });
    gui.add(controls, 'intensity2', 0, 1000).onChange(e=>{
      this.areaLight2.intensity = e;
    });
    gui.addColor(controls, 'color3').onChange(e=>{
      this.areaLight3.color = new THREE.Color(e);
      this.plane3.material.color.set(new THREE.Color(e));
    });
    gui.add(controls, 'intensity3', 0, 1000).onChange(e=>{
      this.areaLight3.intensity = e;
    });

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