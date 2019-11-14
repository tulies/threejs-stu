var width = document.getElementById('canvas-frame').clientWidth;
var height = document.getElementById('canvas-frame').clientHeight;

// 初始化THREE.js，其实也是初始化渲染器
var renderer
function initRenderer(){
  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(width, height)
  document.getElementById('canvas-frame').append(renderer.domElement)
  renderer.setClearColor(0xFFFFFF, 1);

}

var camera
function initCamera(){
  camera = new THREE.PerspectiveCamera(45,width/height,1,10000)
  // 相机位置
  camera.position.set(600, 0, 600)
  // 相机看向的位置
  camera.lookAt(0, 0, 0)
  // 相机快门方向平台于这给点
  camera.up.set(0, 1, 0)
}

var scene
function initScene(){
  scene = new THREE.Scene()
}

// 环境光
function initLight(){
  /**
   * 分别添加light1和light2到scene中看看效果。
   * 2个light同时启用的话，就会看到光混合后的效果，原本未被平行光照射的面会显示环境光的颜色。
   */
  // 环境光与位置无关
  // var light1 = new THREE.AmbientLight(0x00FF00)
  // scene.add(light1)

  /**
   * 平行光
   */
  // var light2 = new THREE.DirectionalLight(0xFF0000)
  // light2.position.set(0,0 ,300)
  // // light2.castShadow = true
  // scene.add(light2)

  /**
   * PointLight( color, intensity, distance, decay )
   * color — 颜色的RBG数值。
   * intensity — 光强的数值。
   * distance -- 光强为0处到光源的距离，0表示无穷大。
   * decay -- 沿着光照距离的衰退量。
   */
  var light3 = new THREE.PointLight(0xFF0000)
  // light3.position.set(0,0 ,-400)
  light3.position.set(0,0 ,70)
  // light2.castShadow = true
  scene.add(light3)
}

// 设置场景中的物体
// 关键的几个东西，Geometry 模型、material 材质、
var mesh
function initObject(){
  // 老版本里面貌似是CubeGeometry，在r76版本的文档中，使用的是BoxGeometry。
  /**
   * width — X轴上的面的宽度.
   * height — Y轴上的面的高度.
   * depth — Z轴上的面的深度.
   * widthSegments — 可选参数. 沿宽度面的分割面数量. 默认值为1.
   * heightSegments — 可选参数. 沿高度面的分割面数量. 默认值为1.
   * depthSegments — 可选参数. 沿深度面的分割面数量. 默认值为1.
   */
  var geometry = new THREE.BoxGeometry(200,100,50)
  var material = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0,0,0)
  scene.add(mesh)

  var geometry2 = new THREE.BoxGeometry(200,100,50)
  var material2 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh2 = new THREE.Mesh(geometry2, material2)
  mesh2.position.set(350,0,0)
  scene.add(mesh2)

  var geometry3 = new THREE.BoxGeometry(200,100,50)
  var material3 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh3 = new THREE.Mesh(geometry3, material3)
  mesh3.position.set(0,200,0)
  scene.add(mesh3)

  var geometry4 = new THREE.BoxGeometry(200,100,50)
  var material4 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh4 = new THREE.Mesh(geometry4, material4)
  mesh4.position.set(0,-200,0)
  scene.add(mesh4)

  var geometry5 = new THREE.BoxGeometry(200,100,50)
  var material5 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh5 = new THREE.Mesh(geometry5, material5)
  mesh5.position.set(-350,0,0)
  scene.add(mesh5)

  var geometry6 = new THREE.BoxGeometry(200,100,50)
  var material6 = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  var mesh6 = new THREE.Mesh(geometry6, material6)
  mesh6.position.set(0,0,-150)
  scene.add(mesh6)
}

function render(){
  renderer.clear()
  renderer.render(scene, camera);
}


function threeStart(){
  initRenderer()
  initCamera()
  initScene()
  // 没有光源的时候，物体就是黑色的，可以注释掉initLight查看效果
  initLight()
  initObject()
  render()
}

window.onload = function(){
  threeStart()
}

