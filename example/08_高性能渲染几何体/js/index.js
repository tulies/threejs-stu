
(function(){
  if ( ! WEBGL.isWebGLAvailable() ) {
    document.body.append(WEBGL.getWebGLErrorMessage());
    return
  }
  var stats;

  var width = document.getElementById('canvas-frame').clientWidth
  var height = document.getElementById('canvas-frame').clientHeight

  var renderer;
  var camera;
  var scene;
  function init(){
    // 相机
    camera = new THREE.PerspectiveCamera(60, width/height, 0.01,100000);
    // camera.position.z = 0.2;
    camera.position.set(0, 0, 2550)
    // camera.lookAt(0, 0, 0)
    // camera.up.set(0, 1, 0)

    // 场景
    scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050505, 2000, 3500)
    // 光
    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
    dirLight.position.set(1,1,1)
    scene.add(dirLight)

    var dirLight2 = new THREE.DirectionalLight( 0xffffff, 1.5 )
    dirLight2.position.set(0,1,0)
    scene.add(dirLight2)
    // 对象
    var triangles = 2000000

    var geometry = new THREE.BufferGeometry()
    var positions = new Float32Array( triangles * 3 * 3)
    // 这里是每个顶点一个法线，也可以一个面一个法线
    var normals = new Float32Array(triangles * 3 * 3)
    // 每个顶点一种颜色
    var colors = new Float32Array(triangles * 3 * 3)

    var color = new THREE.Color();

    // triangles spred in the cube
    var n = 800, n2 = n/2
    // individual triangle size
    var d = 12, d2 = d/2

    var pA = new THREE.Vector3()
    var pB = new THREE.Vector3()
    var pC = new THREE.Vector3()

    var cb = new THREE.Vector3()
    var ab = new THREE.Vector3();

    for(var i = 0; i < positions.length; i+=9){
      // positions
      var x = Math.random() * n - n2
      var y = Math.random() * n - n2
      var z = Math.random() * n - n2

      var ax = x + Math.random() * d - d2
      var ay = y + Math.random() * d - d2
      var az = z + Math.random() * d - d2

      var bx = x + Math.random() * d - d2
      var by = y + Math.random() * d - d2
      var bz = z + Math.random() * d - d2

      var cx = x + Math.random() * d - d2
      var cy = y + Math.random() * d - d2
      var cz = z + Math.random() * d - d2

      // 顶点位置，一个三角形 3个顶点，9个坐标位置
      positions [i] = ax
      positions [i+1] = ay
      positions [i+2] = az

      positions [i+3] = bx
      positions [i+4] = by
      positions [i+5] = bz

      positions [i+6] = cx
      positions [i+7] = cy
      positions [i+8] = cz

      // 法线 -- 对应的也是9个
      pA.set(ax, ay, az)
      pB.set(bx, by, bz)
      pC.set(cx, cy, cz)
      // 根据pA、pB、pC三个顶点坐标计算法线
      cb.subVectors(pC, pB)
      cb.subVectors(pC, pB)
      cb.cross(ab)
      cb.normalize()
      // 设置顶点坐标的法线
      var nx = cb.x
      var ny = cb.y
      var nz = cb.z

      normals[i] = nx
      normals[i+1] = ny
      normals[i+2] = nz

      normals[i+3] = nx
      normals[i+4] = ny
      normals[i+5] = nz

      normals[i+6] = nx
      normals[i+7] = ny
      normals[i+8] = nz

      // 设置colors

      var vx = (x/n) + 0.5
      var vy = (y/n) + 0.5
      var vz = (z/n) + 0.5

      color.setRGB(vx, vy, vz)
      // console.log(color)
      colors[i] = color.r
      colors[i+1] = color.g
      colors[i+2] = color.b

      colors[i+3] = color.r
      colors[i+4] = color.g
      colors[i+5] = color.b

      colors[i+6] = color.r
      colors[i+7] = color.g
      colors[i+8] = color.b
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    // 在这个例子里 这个法向量我其实没看到有什么作用
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.computeBoundingSphere()

    // console.log(geometry)
    var material = new THREE.MeshPhongMaterial({
      // color: 0xAAAAAA,
      // specular: 0xFFFFFF,
      shininess: 250,
      // side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors,
      shading: THREE.FlatShading,
    })
    mesh = new THREE.Mesh(geometry, material)

    // var material = new THREE.PointsMaterial( { size: 1, vertexColors: THREE.VertexColors } );
    // mesh = new THREE.Points( geometry, material );


    scene.add(mesh)

    // 渲染器
    renderer = new THREE.WebGLRenderer({antialias: false})
    renderer.setClearColor(scene.fog.color)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.gammaInput = true
    renderer.gammaOutput = true
    document.getElementById('canvas-frame').append(renderer.domElement)

    initStats()
    render()
  }
  // console.log(121)

  function initStats(){
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
  }

  function render(){
    stats.update();

    // console.log(121)
    var time = Date.now() * 0.01
    mesh.rotation.y = time * 0.1
    mesh.rotation.z = time * 0.1
    mesh.rotation.x = time * 0.1
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  }
  init()
})()
