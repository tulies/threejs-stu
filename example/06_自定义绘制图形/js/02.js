(function(){
  var width = document.getElementById('canvas-frame').clientWidth
  var height = document.getElementById('canvas-frame').clientHeight
  var controls;

  // 相机
  var camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000)
  camera.position.set(0, 0, 80)
  camera.lookAt(0,0,0)
  camera.up.set(0, 1, 0)


  // 场景
  var scene = new THREE.Scene()

  // 光 -- Geometry无需光照
  // var light = new THREE.DirectionalLight(0xFF0000, 1)
  // light.position.set(100,100,100)
  // scene.add(light)
  // 对象
  var geometry = new THREE.Geometry()

  // geometry.colors.push(color1, color2, color3)
  // 一定要注意顶点坐标顺序。 逆时针，顺序，，不然会显示不出来， 或者说不是显示不出来，而是看不到而已，显示到背面（我们看不到的另外一面）去了。
  var vector1 = new THREE.Vector3(10, 0, 0)
  var vector2 = new THREE.Vector3(0, 10, 0)
  var vector3 = new THREE.Vector3(-10, 0, 0)
  geometry.vertices.push(vector1, vector2, vector3)

  var faces3 = new THREE.Face3(0,1,2)
  var color1 = new THREE.Color(0x0090FF)
  var color2 = new THREE.Color(0xFF57FF)
  var color3 = new THREE.Color(0x0F9000)
  faces3.vertexColors.push(color1, color2, color3)

  geometry.faces.push(faces3)

  // MeshBasicMaterial无需光照
  /**
   * vertexColors — 定义顶点如何着色。默认值是 THREE.NoColors.
   * wireframe — 渲染模型为线框。默认是false。
   * color — 线条的十六进制颜色。缺省值为 0xffffff。
   */
  var materal = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    // color: 0xFF0000,
    // wireframe: true
  })
  var mesh = new THREE.Mesh(geometry, materal)
  scene.add(mesh)

  var renderer = new THREE.WebGLRenderer({antialias:false})
  renderer.setSize(width, height)
  document.getElementById('canvas-frame').append(renderer.domElement)
  renderer.setClearColor(0xFFFFFF, 1)


  function render(){
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  }

  render()
})()
