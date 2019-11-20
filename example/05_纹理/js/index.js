var width = document.getElementById('canvas-frame').clientWidth
var height = document.getElementById('canvas-frame').clientHeight

var renderer;
var camera;
var scene;
var texture;
function init(){
  // 渲染器
  renderer = new THREE.WebGLRenderer({antialias: true}) 
  renderer.setSize(width, height)
  document.getElementById('canvas-frame').append(renderer.domElement)
  renderer.setClearColor(0xFFFFFF, 1)

  // 相机
  camera = new THREE.PerspectiveCamera(60, width/height, 1,10000);
  camera.position.set(0, 0, 600)
  camera.lookAt(0, 0, 0)
  camera.up.set(0, 1, 0)

  // 场景
  scene = new THREE.Scene()
  var geometry = new THREE.PlaneGeometry(600,400,1,1)
  // 下面这个纹理坐标暂时没有搞懂什么意思，有点思路暂不深究
  // geometry.vertices[0].uv = new THREE.Vector2(0,0);
  // geometry.vertices[1].uv = new THREE.Vector2(2,0);
  // geometry.vertices[2].uv = new THREE.Vector2(2,2);
  // geometry.vertices[3].uv = new THREE.Vector2(0,2);
  var textureLoader = new THREE.TextureLoader()
  textureLoader.crossOrigin = 'anonymous'
  texture = textureLoader.load( "textures/1.jpg",function(t){
    console.log('loaded')
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set( 4, 4 );
    	// do something with the texture
		var material = new THREE.MeshBasicMaterial( {
			map: t
    } );
    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  } );

  render()
}

function render(){
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
init()