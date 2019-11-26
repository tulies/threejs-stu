(function(){
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,0.1, 1000);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true  // 是否执行抗锯齿。默认为false
  });
  // 设置场景背景色
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;


  //  在场景中显示坐标轴
  // const axes = new THREE.AxesHelper(20);
  // scene.add(axes);

  // 创建平面几何体
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xAAAAAA
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  plane.receiveShadow = true; // 接收阴影
  scene.add(plane);

  // 创建立方体
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color:0xFF0000,
    // wireframe: true  // 将几何体渲染为线框,默认值为false
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, 3, 0);
  cube.castShadow = true; //投射阴影
  scene.add(cube);

  // 创建球几何体
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777FF,
    // wireframe: true  // 将几何体渲染为线框,默认值为false
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // position the sphere
  sphere.position.set(20, 4, 2);
  sphere.castShadow = true; //投射阴影
  scene.add(sphere);

  // 添加光源--聚光灯
  const  spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true; // 定义能够产生阴影的光源
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);

  // 添加光源--环境光
  var ambienLight = new THREE.AmbientLight(0x353535);
  scene.add(ambienLight);

  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  document.getElementById('webgl-frame').append(renderer.domElement);
  renderer.render(scene, camera);
})();