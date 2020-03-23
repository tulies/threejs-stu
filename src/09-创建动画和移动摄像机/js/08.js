/**
 * MeshBasicMaterial 材质不考虑场景中光照的影响。
 * 所以设置的color是啥颜色就是啥颜色，另外receiveShadow也是无效的。
 * 光照在上面也是无效果的，看不出光线。
 */
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
    camera.position.set(0, 10, 70);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initObject(){
    // JSONLoader已经不推荐使用了
    const loader = new THREE.LegacyJSONLoader();
    loader.load('../../assets/models/horse/horse.js',(geometry)=>{
        console.log(geometry);
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        console.log(geometry);

        // geometry.computeVertexNormals();
        // geometry.computeMorphNormals();

        const mat = new THREE.MeshLambertMaterial({morphTargets: true, vertexColors: THREE.FaceColors});
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.scale.set(0.15,0.15,0.15);
        mesh.translateY(-10);
        mesh.translateX(10);


        const mixer = new THREE.AnimationMixer( mesh );
        // or create a custom clip from the set of morphtargets
        const animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'run', geometry.morphAttributes.position, 20 );
        // animationClip = geometry.animations[0]; 
        const clipAction = mixer.clipAction( animationClip ).play();    
        
        clipAction.setLoop(THREE.LoopRepeat);
        this.scene.add(mesh);
        this.mixer = mixer;

    });
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

    if(this.mixer){
      this.mixer.update(delta);
    }
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