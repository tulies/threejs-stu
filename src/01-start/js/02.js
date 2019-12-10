
(function(){
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,0.1, 1000);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  // 设置场景背景色
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);


  //  在场景中显示坐标轴
  const axes = new THREE.AxesHelper(20);
  scene.add(axes);

  // 创建平面几何体
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xAAAAAA
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  scene.add(plane);

  // 创建立方体
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color:0xFF0000,
    wireframe: true
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, 3, 0);
  scene.add(cube);

  // 创建球几何体
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777FF,
    wireframe: true
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // position the sphere
  sphere.position.set(20, 4, 2);
  scene.add(sphere);

  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  document.getElementById('webgl-frame').append(renderer.domElement);
  renderer.render(scene, camera);
})();