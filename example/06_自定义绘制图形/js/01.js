(function(){
  var width = document.getElementById('canvas-frame').clientWidth
  var height = document.getElementById('canvas-frame').clientHeight

  // 相机
  var camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000)
  camera.position.set(0, 0, 200)
  camera.lookAt(0,0,0)
  camera.up.set(0, 1, 0)

  // 场景
  var scene = new THREE.Scene()

  // 对象
  var geometry = new THREE.PlaneGeometry(100, 50)
  console.log(geometry)
  var color1 = new THREE.Color(0x0090FF)
  var color2 = new THREE.Color(0xFF57FF)
  var color3 = new THREE.Color(0x0F9000)

  for(var i = 0; i < geometry.faces.length; i++){
    var f = geometry.faces[i]
    f.vertexColors[0] = color1
    f.vertexColors[1] = color2
    f.vertexColors[2] = color3
  }
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

  renderer.render(scene, camera)

})()
