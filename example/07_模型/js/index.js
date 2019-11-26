
(function(){

  if ( ! WEBGL.isWebGLAvailable() ) {
    document.body.append(WEBGL.getWebGLErrorMessage());
    return
  }

  var width = document.getElementById('canvas-frame').clientWidth
  var height = document.getElementById('canvas-frame').clientHeight

  var renderer;
  var camera;
  var scene;
  var controls;
  function init(){
    // 渲染器
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(width, height)
    document.getElementById('canvas-frame').append(renderer.domElement)
    renderer.setClearColor(0x000000, 1)

    // 相机
    camera = new THREE.PerspectiveCamera(60, width/height, 0.01,10000);
    // camera.position.z = 0.2;
    camera.position.set(0, 0, 0.3)
    camera.lookAt(0, 0, 0)
    camera.up.set(0, 1, 0)


    // 对相机进行控制
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    // 场景
    scene = new THREE.Scene()
    // 光
    var dirLight = new THREE.DirectionalLight( 0xffffff )
    // normalize这个是啥意思呢
    // dirLight.position.set(200,200,1000).normalize()
    dirLight.position.set(200,200,1000)
    scene.add(dirLight)

    // 对象
    var material = new THREE.MeshLambertMaterial({color:0xFFFFFF, side: THREE.DoubleSide})
    var loader = new THREE.VTKLoader();
    loader.load('models/vtk/bunny.vtk',function(geometry){
      geometry.computeVertexNormals();
      console.log(geometry)
      var mesh = new THREE.Mesh(geometry, material)
      mesh.position.setY(-0.09)
      scene.add(mesh)
    })
    render()
  }

  function render(){
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  }
  init()
})()
