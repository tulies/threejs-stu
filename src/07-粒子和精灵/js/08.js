class ThreeCase {
  constructor(){
    this.stats = initStats();

    // 三要素 渲染器 - 相机 - 场景
    this.renderer = this.initRenderer();
    this.camera = this.initCamera();
    this.scene = new THREE.Scene();

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
    camera.position.set(0, 0, 110);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initObject(){
    const loader = new THREE.TextureLoader();
    const texture1 = loader.load("../../assets/textures/particles/snowflake1_t.png");
    const texture2 = loader.load("../../assets/textures/particles/snowflake2_t.png");
    const texture3 = loader.load("../../assets/textures/particles/snowflake3_t.png");
    const texture4 = loader.load("../../assets/textures/particles/snowflake5_t.png");

    const createPoints = (texture)=>{
      const geom = new THREE.Geometry();
      const color = new THREE.Color(0xffffff);
      const hsl = {};
      color.getHSL(hsl);
      color.setHSL(hsl.h,
        hsl.s,
        (Math.random()) * hsl.l);  // 只改变了亮度
      const material = new THREE.PointsMaterial({
        size: 10,
        transparent: true,
        opacity: 0.6,
        // vertexColors: true,
        map: texture, // 使用画布作为纹理
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true, 
        depthWrite: false,
        color: color
      });
      const range = 40;
      for(let i = 0; i<100; i++){
        const particle = new THREE.Vector3(
          Math.random() * range - range / 2,
          Math.random() * range * 1.5,
          Math.random() * range - range / 2
          // 1 + (i/100)

        );
        particle.velocityY = 0.1 + Math.random() / 5;
        particle.velocityX = (Math.random() - 0.5) / 3;
        particle.velocityZ = (Math.random() - 0.5) / 3;
        geom.vertices.push(particle);
      }
  
      const points = new THREE.Points(geom, material);
      // points.sortParticles = true; // 新版本中已经没有这个功能了
      points.name = 'particles1';
      points.position.set(0,-30,0);
      this.scene.add(points);
    };

    createPoints(texture1);
    createPoints(texture2);
    createPoints(texture3);
    createPoints(texture4);
    
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

    this.scene.children.forEach(function (child) {
      if (child instanceof THREE.Points) {
        const vertices = child.geometry.vertices;
        vertices.forEach(function (v) {
          v.y = v.y - (v.velocityY);
          v.x = v.x - (v.velocityX);
          v.z = v.z - (v.velocityZ);

          if (v.y <= 0) v.y = 60;
          if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
          if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
        });

        child.geometry.verticesNeedUpdate = true;
      }
    });
    
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