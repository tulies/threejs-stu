class ThreeCase {
  constructor(){
    this.stats = initStats();

    // 三要素 渲染器 - 相机 - 场景
    this.renderer = this.initCanvasRenderer();
    this.camera = this.initCamera();
    this.scene = new THREE.Scene();

    this.trackballControls = initTrackballControls(this.camera, this.renderer);
    this.clock = new THREE.Clock();
    this.init();
  }
  // initRenderer(){
  //   const renderer = new THREE.WebGLRenderer();
  //   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //   renderer.shadowMap.enabled = true;
  //   renderer.setClearColor(new THREE.Color(0x000000));
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   document.getElementById("webgl-frame").appendChild(renderer.domElement);
  //   return renderer;
  // }
  initCanvasRenderer(){
    const canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setClearColor(new THREE.Color(0x000000));
    canvasRenderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-frame").appendChild(canvasRenderer.domElement);

    return canvasRenderer;
  }

  initCamera(){
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initObject(){

    // 不演示了 ，SpriteCanvasMaterial 已经被废弃了
  }
  initLight(){
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    // spotLight.target = this.cubeMesh;
    spotLight.distance = 0;
    spotLight.angle = 0.4;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 120;
    this.scene.add(spotLight);
  }

  initGUIControls(){
    // this.controls = {
    //   color: this.meshMaterial.color.getStyle(),
    //   selectedMesh: 'cube'
    // };
    // const gui = new dat.GUI();
    

  }
  init(){
    this.initObject();
    this.initLight();
    this.initGUIControls();
  }
  render(){
    
    this.stats.update();
    const delta = this.clock.getDelta();

    this.trackballControls.update(delta);

    requestAnimationFrame(()=>{
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }
  resize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

(function(){
  const threeCase = new ThreeCase();
  threeCase.render();
  window.addEventListener('resize', ()=>{
    threeCase.resize();
  }, false);
})();