(function(){
  const stats = initStats();

  const init = ()=>{
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 平面几何体
    const planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    // 设置相机位置
    camera.position.set(-50, 30, 20);
    camera.lookAt(new THREE.Vector3(-10, 0, 0));



    // add geometries
    // addGeometries(scene);
    const vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1)
    ];
    const faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(2, 3, 1),
      new THREE.Face3(4, 6, 5),
      new THREE.Face3(6, 7, 5),
      new THREE.Face3(4, 5, 1),
      new THREE.Face3(5, 0, 1),
      new THREE.Face3(7, 6, 2),
      new THREE.Face3(6, 3, 2),
      new THREE.Face3(5, 7, 0),
      new THREE.Face3(7, 2, 0),
      new THREE.Face3(1, 3, 4),
      new THREE.Face3(3, 6, 4)
    ];

    const geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    //计算面法向量
    geometry.computeFaceNormals();

    const materials = [
      new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
      new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
    ];

    const mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    mesh.castShadow = true;
    mesh.children.forEach(function (e) {
      e.castShadow = true;
    });

    scene.add(mesh);


    //设置光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    // 聚光灯
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1, 180, Math.PI/4);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.position.set(-40,30,30);
    spotLight.lookAt(mesh);
    spotLight.castShadow = true;
    scene.add(spotLight);

    console.log(mesh);

    // 加一些控制
    const addControl = function(x, y, z) {
      var controls = new function () {
          this.x = x;
          this.y = y;
          this.z = z;
      };
      return controls;
    };
    const controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));
    const gui = new dat.GUI();
    // 定义一个clone方法
    gui.add(new function(){
      this.clone = function(){
        const clonedGeometry = mesh.children[0].geometry.clone();
        const materials2 = [
          new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
          new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ];
        const mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials2);
        mesh2.translateX(5);
        mesh2.translateZ(5);
        mesh2.name='clone';
        // mesh2.castShadow = true;
        mesh2.traverse(function(e){
          console.log(e);
          e.castShadow = true;
        });
        // 每次点击删除之前一个
        scene.remove(scene.getChildByName('clone'));
        scene.add(mesh2);
      };
    },'clone');

    for( var i = 0; i < 8; i++ ) {
      f1 = gui.addFolder('Vertices ' + (i + 1));
      f1.add(controlPoints[i], 'x', -10, 10);
      f1.add(controlPoints[i], 'y', -10, 10);
      f1.add(controlPoints[i], 'z', -10, 10);
    }

    document.getElementById('webgl-frame').append(renderer.domElement);

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    const render = function(){
      trackballControls.update(clock.getDelta());
      stats.update();


      var vertices = [];
      for (var i = 0; i < 8; i++) {
          vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
      }
      mesh.children.forEach(function (e) {
        console.log;
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;
        e.geometry.computeFaceNormals();
        delete e.geometry.__directGeometry;
      });



      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    const onResize = () =>{
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render();
    window.addEventListener('resize', onResize, false);


  };

  init();

})();