var width = document.getElementById('canvas-frame').clientWidth;
var height = document.getElementById('canvas-frame').clientHeight;
var stats;

// 初始化THREE.js，其实也是初始化渲染器
var renderer
function initRenderer(){
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height)
  document.getElementById('canvas-frame').append(renderer.domElement)
  renderer.setClearColor('#fff',1)
}

var camera
function initCamera(){
  camera = new THREE.PerspectiveCamera(45,width/height, 1, 10000)
  camera.position.set(0,0,600);
  camera.up.set(0,1,0);
  camera.lookAt(0,0,0)
}

var scene
function initScene(){
  scene = new THREE.Scene();
}

// 设置了2光光源
function initLight(){
  // 环境光
  // var light1 = new THREE.AmbientLight(0xFFFFFF)
  // light1.position.set(100, 100, 200)
  // scene.add(light1)

  // 点光源-- 可以看到物体表面的颜色深浅度变化
  var light2 = new THREE.PointLight(0x00FF00)
  light2.position.set(0,0,300)
  scene.add(light2)
}

// 设置场景中的物体
// 关键的几个东西，Geometry 模型、material 材质、
var mesh
function initObject(){
  /*
    【CircleGeometry】 一个用来创建圆柱几何体模型的类
    radiusTop — 圆柱体顶端半径. 默认值为20.
    radiusBottom — 圆柱体底端半径. 默认值为20.
    height — 圆柱体高度. 默认值为100.
    radiusSegments — 围绕圆柱体周长的分割面数量. 默认值为8.
    heightSegments — 沿圆柱体高度的分割面数量. 默认值为1.
    openEnded — 指示圆柱体两端是打开还是覆盖的布尔值. 默认值为false, 意思是覆盖.
    thetaStart — 第一个分割面的开始角度, 默认值 = 0 (3点钟方向).
    thetaLength — 圆形扇形的圆心角通常称为θ。默认为2 * Pi，这形成了一个完整的圆柱体.
  */
  var geometry = new THREE.CylinderGeometry(50,80,150);
  // 兰伯特网孔材料 MeshLambertMaterial，一种考虑光照的材质（部分材料是不受光源影响，比如MeshBasicMaterial等）
  var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF})

  // 这个mesh 我也有疑问，和LineSegments实例出来的有啥区别，都是整合了geometry和material的。
  mesh = new THREE.Mesh(geometry, material)
  // mesh.position = new THREE.Vector3(0,0,0)
  mesh.position.set(0,0,0)
  scene.add(mesh)
}

function render(){
	// stats.begin()
  stats.update();

  // 让场景动起来
  // // 第一种方式，移动相机位置，向左移动
  // camera.position.x += 1
  // 第二种方式，让场景里的物体动起来,向左移动
  mesh.position.x -= 1

  renderer.render(scene, camera)
  // stats.end()

  requestAnimationFrame(render)
}

function initStats(){
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
}
function threeStart(){
  initRenderer()
  initCamera()
  initScene()
  initLight()
  initObject()
  initStats()
  render()


}

window.onload = function(){
  threeStart()
}

