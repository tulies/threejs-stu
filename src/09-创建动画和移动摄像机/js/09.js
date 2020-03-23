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
    // initial cube
    let cubeGeometry = new THREE.BoxGeometry(2,2,2);
    // cubeGeometry.morphAttributes.po
    /**
     * .morphTargets : Boolean
     * 定义材质是否使用morphTargets。默认值为false。
     */
    const cubeMaterial = new THREE.MeshLambertMaterial({morphTargets: true, color:0xff0000});
  
    //  define morphtargets, we'll use the vertices from these geometries
    const cubeTarget1 = new THREE.BoxGeometry(2, 20, 2);
    const cubeTarget2 = new THREE.BoxGeometry(40, 2, 2);
    // cubeGeometry.morphTargets.push();

    console.log(cubeGeometry);
    
    cubeGeometry.morphTargets[0] = {name:'t1', vertices: cubeGeometry.vertices};
    cubeGeometry.morphTargets[1] = {name:'t2', vertices: cubeTarget2.vertices};
    cubeGeometry.morphTargets[2] = {name:'t3', vertices: cubeTarget1.vertices};
    // cubeGeometry.computeMorphNormals();
    // console.log(cubeGeometry);
    cubeGeometry = new THREE.BufferGeometry().fromGeometry( cubeGeometry );
    console.log(cubeGeometry);

    const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    mesh.position.set(0, 3, 0);

    this.scene.add(mesh);
    console.log(cubeGeometry.morphAttributes.position);
    const mixer = new THREE.AnimationMixer(mesh);
    
    const animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('first', [cubeGeometry.morphAttributes.position[0], cubeGeometry.morphAttributes.position[1]], 1);
    const animationClip2 = THREE.AnimationClip.CreateFromMorphTargetSequence('second', [cubeGeometry.morphAttributes.position[0], cubeGeometry.morphAttributes.position[2]], 1);

    const clipAction = mixer.clipAction( animationClip).play();
    const clipAction2 = mixer.clipAction(animationClip2).play();
    
    clipAction.setLoop(THREE.LoopRepeat);
    clipAction2.setLoop(THREE.LoopRepeat);

    this.mixer = mixer;
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