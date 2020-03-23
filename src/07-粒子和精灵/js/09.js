class ThreeCase {
  constructor(){
    this.stats = initStats();
    this.step = 0;

    this.spriteNumber = 0;

    // 三要素 渲染器 - 相机 - 场景
    this.renderer = this.initRenderer();
    this.camera = this.initCamera();
    this.scene = new THREE.Scene();

    this.sceneOrtho = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);


    this.trackballControls = initTrackballControls(this.camera, this.renderer);
    this.clock = new THREE.Clock();
    this.init();
  }
  initRenderer(){
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-frame").appendChild(renderer.domElement);
    return renderer;
  }

  initCamera(){
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initObject(){
    const material = new THREE.MeshNormalMaterial();
    // const material = new THREE.MeshBasicMaterial();
    const geom = new THREE.SphereGeometry(15, 20, 20);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(0,0,0);
    this.scene.add(mesh);
    const texture = new THREE.TextureLoader().load('../../assets/textures/particles/sprite-sheet.png');

    const spriteMaterial = new THREE.SpriteMaterial({
      opacity: 0.6,
      color: 0xffffff,
      transparent: true,
      map:texture
    });

    const size = 150;
    // we have 1 row, with five sprites
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * this.spriteNumber, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.blending = THREE.AdditiveBlending;
    // make sure the object is always rendered at the front
    spriteMaterial.depthTest = false;
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(100, 50, -10);
    sprite.velocityX = 5;

    this.sceneOrtho.add(sprite);
    
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
    // const delta = this.clock.getDelta();
    // this.trackballControls.update(delta);
    
    this.camera.position.y = Math.sin(this.step += 0.01) * 20;

    this.sceneOrtho.children.forEach((e) =>{
      if (e instanceof THREE.Sprite) {
        // move the sprite along the bottom
        e.position.x = e.position.x + e.velocityX;
        if (e.position.x > window.innerWidth) {
          e.velocityX = -5;
          this.spriteNumber += 1;
          e.material.map.offset.set(1 / 5 * (this.spriteNumber % 4), 0);
        }
        if (e.position.x < 0) {
          e.velocityX = 5;
        }
      }
    });


    requestAnimationFrame(()=>{
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = false;
    this.renderer.render(this.sceneOrtho, this.cameraOrtho);
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