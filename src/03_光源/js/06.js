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
  }
  initObject(){
    const planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
    const planeMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.044676705160855, // calculated from shininess = 1000
      metalness: 0.0

    });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.receiveShadow  = true;

    // rotate and position the plane
    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;

    // add the plane to the scene
    this.scene.add(this.plane);
  }
  initLight(){


    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.intensity = 0.1;
    spotLight0.lookAt(this.plane);
    this.scene.add(spotLight0);


  }
  render(){
    this.stats.update();
    this.trackballControls.update();
    console.log(111);
    requestAnimationFrame(()=>{
      this.render();
    });
    // console.log(this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}

(function(){
  const threeCase = new ThreeCase();
  threeCase.render();
})();