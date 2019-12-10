/**
 * MeshBasicMaterial 材质不考虑场景中光照的影响。
 * 所以设置的color是啥颜色就是啥颜色，另外receiveShadow也是无效的。
 * 光照在上面也是无效果的，看不出光线。
 */
class ThreeCase {
  constructor(){
    this.step = 0;
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
    camera.position.set(-40, 70, 40);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initObject(){
    // 平面
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 4, 4),
      // 这边用的是MeshBasicMaterial，可以换成MeshPhongMaterial试试看效果如何。
      new THREE.MeshBasicMaterial({
        color: 0x777777
      })
    );
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.position.y = -20;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    // 定义一些几何体备用
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x7777ff,
      name: 'Basic Material',
      flatShading: true // 平面着色
    });
    this.sphereMesh = new THREE.Mesh( new THREE.SphereGeometry(14, 20, 20), meshMaterial );
    this.cubeMesh = new THREE.Mesh( new THREE.BoxGeometry(15, 15, 15), meshMaterial );
    this.planeMesh = new THREE.Mesh( new THREE.PlaneGeometry(14, 14, 4, 4), meshMaterial );

    this.sphereMesh.position.set(0, 3, 2);
    this.cubeMesh.position.copy(this.sphereMesh.position);
    this.planeMesh.position.copy(this.sphereMesh.position);

    this.sphereMesh.castShadow = true;
    this.cubeMesh.castShadow = true;
    this.planeMesh.castShadow = true;

    // 默认加入cubeMesh
    this.selectedMesh = this.cubeMesh;
    this.scene.add(this.selectedMesh);
    this.meshMaterial = meshMaterial;
  }
  initLight(){
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.target = this.cubeMesh;
    spotLight.distance = 0;
    spotLight.angle = 0.4;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 120;
    this.scene.add(spotLight);
  }

  initGUIControls(){
    this.controls = {
      color: this.meshMaterial.color.getStyle(),
      selectedMesh: 'cube'
    };
    const gui = new dat.GUI();
    // Material 基础属性
    const basicProps = gui.addFolder('THREE.Material');
    basicProps.add(this.meshMaterial, 'id');
    basicProps.add(this.meshMaterial, 'uuid');
    basicProps.add(this.meshMaterial, 'name');
    basicProps.add(this.meshMaterial, 'opacity', 0, 1, 0.01);
    basicProps.add(this.meshMaterial, 'transparent');
    basicProps.add(this.meshMaterial, 'visible');
    basicProps.add(this.meshMaterial, 'side', {FrontSide: 0, BackSide: 1, BothSides: 2}).onChange(side=>{
        this.meshMaterial.side = parseInt(side);
    });
    basicProps.add(this.meshMaterial, 'colorWrite');
    basicProps.add(this.meshMaterial, 'flatShading').onChange(shading => {
        this.meshMaterial.flatShading = shading;
        this.meshMaterial.needsUpdate = true;
    });
    basicProps.add(this.meshMaterial, 'premultipliedAlpha');
    basicProps.add(this.meshMaterial, 'dithering');
    basicProps.add(this.meshMaterial, 'shadowSide', {FrontSide: 0, BackSide: 1, BothSides: 2});
    basicProps.add(this.meshMaterial, 'vertexColors', {NoColors: THREE.NoColors, FaceColors: THREE.FaceColors, VertexColors: THREE.VertexColors}).onChange(vertexColors => {
      this.meshMaterial.vertexColors = parseInt(vertexColors);
    });
    basicProps.add(this.meshMaterial, 'fog');
    // MeshBasicMaterial 的 属性
    const spProps = gui.addFolder('THREE.MeshBasicMaterial');
    spProps.addColor(this.controls, 'color').onChange(e => {
      this.meshMaterial.color.setStyle(e);
    });
    spProps.add(this.meshMaterial, 'wireframe');
    spProps.add(this.meshMaterial, 'wireframeLinewidth', 0, 20);
    spProps.add(this.meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(e => {
      this.meshMaterial.wireframeLinejoin = e;
    });
    spProps.add(this.meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(e => {
      this.meshMaterial.wireframeLinecap = e;
    });

   // 其他一些属性
  gui.add(this.controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange(e=>{
    this.scene.remove(this.cubeMesh);
    this.scene.remove(this.sphereMesh);
    this.scene.remove(this.planeMesh);
    switch (e) {
      case 'cube':
        this.selectedMesh = this.cubeMesh;
        break;
      case 'sphere':
        this.selectedMesh = this.sphereMesh;
        break;
      case 'plane':
        this.selectedMesh = this.planeMesh;
        break;
    }
    this.scene.add(this.selectedMesh);
  });

  }
  init(){
    this.initObject();
    this.initLight();
    this.initGUIControls();
  }
  render(){
    this.stats.update();
    this.trackballControls.update();

    this.selectedMesh.rotation.y += 0.01;

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