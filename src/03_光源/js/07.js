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


    var pointColor = "#ffffff";
    //    var spotLight = new THREE.SpotLight( pointColor);
    var spotLight = new THREE.DirectionalLight(pointColor);
    spotLight.position.set(30, 10, -50);
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 0.1;
    spotLight.shadowCameraFar = 100;
    spotLight.shadowCameraFov = 50;
    spotLight.target = this.plane;
    spotLight.distance = 0;
    spotLight.shadowCameraNear = 2;
    spotLight.shadowCameraFar = 200;
    spotLight.shadowCameraLeft = -100;
    spotLight.shadowCameraRight = 100;
    spotLight.shadowCameraTop = 100;
    spotLight.shadowCameraBottom = -100;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    this.spotLight = spotLight;
    this.scene.add(this.spotLight);

  }
    // 镜头眩晕的代码,需要额外导入js文件 /libs/three/objects/Lensflare.js

  initLensFlare(){
    const textureFlare0 = THREE.ImageUtils.loadTexture("../../assets/textures/flares/lensflare0.png");
    // const textureFlare3 = THREE.ImageUtils.loadTexture("../../assets/textures/flares/lensflare3.png");

    const flareColor = new THREE.Color(0xffaacc);
    const lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);
    lensFlare.position.copy(this.spotLight.position);
    this.scene.add(lensFlare);


  }
  initGUIControls(){

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