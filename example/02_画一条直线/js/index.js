var width = document.getElementById('canvas-frame').clientWidth;
var height = document.getElementById('canvas-frame').clientHeight;

// 初始化渲染器
var renderer;
function initRenderer(){
  renderer = new THREE.WebGLRenderer({
    // 是否抗锯齿
    antialias: true
  })
  // 设置要渲染的区域大小
  renderer.setSize(width,height)
  // 渲染到指定的dom下。
  document.getElementById('canvas-frame').append(renderer.domElement)
  // 清除画布，并设置默认背景色和透明度
  renderer.setClearColor(0xFFFFFF, 1.0)
}

// 初始化相机
var camera;
function initCamera(){
 /**
 * fov, aspect, near, far
 * fov 视角
 * aspect 纵横比
 * near 近平面距离
 * far 远平面距离
 */
  // PerspectiveCamera 远景相机 远景投影，也称之为透视投影
  camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000)

  /**
   * 下面这3个参数（postion、up、lookAt）的含义：
   * 上面这3个参数的含义，白话相当于：
   * 假如人比做相机，人的眼睛就是相机的镜头，人的头顶相当于按拍照的快门
   * 上面的3个位置就是这样的： 人站在position:[0,1000,0]这个位置，眼睛看向lookAt:[0,0,0]这个坐标点的方向，而且头顶眼神出去的方向指向up:[0,0,1]
   * 正常情况position:[0,1000,0]和lookAt:[0,0,0]连成的线和position:[0,1000,0]和up:[0,0,1]连成的线是垂直的。
   */
  // 相机摆在什么坐标位置上
  camera.position.set(0, 1000, 0)
  // 相机垂直上方的坐标点
  camera.up.set(0, 0, 1)
  // 相机看向什么坐标方向
  camera.lookAt(0, 0, 0)
}

// 初始化场景
var scene;
function initScene(){
  scene = new THREE.Scene();
}

// 场景中----初始化光照
function initLight(){
  /**
   * 平行光源
   * hex -- 光源颜色的RGB数值。
   * intensity -- 光源强度的数值。
   */
  var light = new THREE.DirectionalLight(0xFF0000, 1.0)
  // 光源所在的坐标位置
  light.position.set(100, 100, 200)
  // 添加到场景中
  scene.add(light)
}

// 场景中 --- 要放在场景中的东西 ---初始化线条
function initObject(){
  // 定义几何模型，Geometry是所有几何模型的基类。
  var geometry = new THREE.Geometry()
  // 基础线条材料
  var material = new THREE.LineBasicMaterial({
    // 定义顶点如何着色
    vertexColors: THREE.VertexColors
  })

  // 设置线条2个顶点的颜色
  var color1 = new THREE.Color(0x444444)
  var color2 = new THREE.Color( 0xff0000 )
  // 设置线条2个顶点的坐标
  var p1 = new THREE.Vector3(-100, 0, 100)
  var p2 = new THREE.Vector3(100,0,-100)

  // 添加到几何模型中
  geometry.vertices.push(p1,p2)
  geometry.colors.push(color1,color2)

  // 定义线段（成对的点之间的连线），设置几何模型和材质设置
  var line = new THREE.LineSegments(geometry, material)
  // 把线条添加到场景中
  scene.add(line)
}

// 执行渲染
function render(){
  renderer.clear()
  // 相当于把相机、场景通过渲染器进行整合
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

function threeStart(){
  initRenderer()
  initCamera()
  initScene()
  initLight()
  initObject()
  render()
}

window.onload = function(){
  threeStart()
}

