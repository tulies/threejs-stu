(function(){
  const stats = initStats();
  const addGeometries = (scene) => {
    var geoms = [];

    // 圆柱几何体
    geoms.push(new THREE.CylinderGeometry(1, 4, 4));

    // 立方几何体
    geoms.push(new THREE.BoxGeometry(2, 2, 2));

    // 球几何体
    geoms.push(new THREE.SphereGeometry(2));

    // 二十面体
    geoms.push(new THREE.IcosahedronGeometry(4));

    // 凸面体  需要导入 ConvexGeometry.js + ConvexHull.js
    var points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2)
    ];
    geoms.push(new THREE.ConvexGeometry(points));

    // 圆锥体
    geoms.push(new THREE.ConeGeometry( 3, 5, 32 ));

    // 车削几何体
    var pts = []; //points array - the path profile points will be stored here
    var detail = .1; //half-circle detail - how many angle increments will be used to generate points
    var radius = 3; //radius for half_sphere
    for (var angle = 0.0; angle < Math.PI; angle += detail) //loop from 0.0 radians to PI (0 - 180 degrees)
        pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)); //angle/radius to x,z
    geoms.push(new THREE.LatheGeometry(pts, 12));

    // 八面几何体
    geoms.push(new THREE.OctahedronGeometry(3));

    // 参数化几何体 需要导入 ParametricGeometries.js
    geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

    // 四面几何体
    geoms.push(new THREE.TetrahedronGeometry(3));

    // 圆环几何体
    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

    // 圆环扭结几何体
    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

    var j = 0;
    for (var i = 0; i < geoms.length; i++) {

        var materials = [
            new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true
            })

        ];
        // 需要导入 /examples/js/utils/SceneUtils.js
        var mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
        mesh.traverse(function (e) {
            e.castShadow = true;
        });

        //var mesh = new THREE.Mesh(geoms[i],materials[i]);
        //mesh.castShadow=true;
        mesh.position.x = -24 + ((i % 4) * 12);
        mesh.position.y = 4;
        mesh.position.z = -8 + (j * 12);

        if ((i + 1) % 4 == 0) j++;
        scene.add(mesh);


        // const wireframe = new THREE.WireframeGeometry(geoms[i]);
        // const line = new THREE.LineSegments(wireframe);
        // scene.add(line);
        // line.material.linewidth = 2;


    }

  };
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

    //设置光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    // 聚光灯
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1.2, 150, Math.PI/4, 0, 2);
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.position.set(-40,30,30);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add geometries
    addGeometries(scene);

    document.getElementById('webgl-frame').append(renderer.domElement);

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();
    const render = function(){
      trackballControls.update(clock.getDelta());
      stats.update();

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