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
   * color — 光源颜色的RGB数值。
   * intensity -- 光源强度的数值。
   */
  // var light = new THREE.AmbientLight(0xFF0000)
  // light.position.set(100,100,200)
  // scene.add(light)

  var light2 = new THREE.DirectionalLight(0xFF0000)
  light2.position.set(1,0 ,0.5)
  scene.add(light2)
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

