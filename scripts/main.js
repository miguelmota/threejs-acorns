// a scene, a camera, and a renderer are required to display anything

// SCENE
var scene = new THREE.Scene();

// CAMERA
// arg1: vertical field of view in degrees
// arg2: aspect ratio
// arg3: near clipping plane
// arg4: far clipping plane
// if object is too far or too close to camera it won't render
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
camera.position.set(30,40,120);
camera.lookAt(new THREE.Vector3(0,0,0));

// RENDERER
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// LIGHT
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1,1,1).normalize();
light.castShadow = true;
light.shadowDarkness = 0.5;
light.shadowCameraNear  = 0.01;
light.shadowCameraVisible = true;
scene.add(light);

var planeGeometry = new THREE.BoxGeometry(100,100,5,1,1,1);
var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture('images/wood-floor.jpg')});
var plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.material.side = THREE.DoubleSide;
plane.castShadow = true;
plane.receiveShadow  = false;

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = -5;
plane.position.z = 0;
scene.add(plane);

var colors = {
  primary: 0x74C947,
  emissive: 0x005500
};

// CUBE
// arg1: width of sides on x axis
// arg2: height of sides on y axis
// arg3: depth of sides on z axis
// arg4, arg5, arg6: optional - segmented faces along the width, height, and depth respectively
var cubeGeometry = new THREE.BoxGeometry(500,500,500,32,32,32);
var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x0fffff, wireframe: true});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// format: [x,y]
var acornPoints = [
  [2.5, 0], // top of stem
  [2.25, 0.5],
  [2.07, 0.75], // bottom of stem
  [1.33, 0.871], // top of head
  [1, 1],
  [0.63, 1.25],
  [0.40, 1.5],
  [0.19, 1.75],
  [0.09, 2],
  [0, 2.25],
  [0.07, 2.75],
  [0.9, 2.89],
  [0.16, 2.89], // bottom of head
  [0.30, 3.09], // top of body
  [0.31, 3.25],
  [0.28, 3.50],
  [0.28, 3.75],
  [0.34, 4],
  [0.39, 4.24],
  [0.48, 4.5],
  [0.61, 4.75],
  [0.75, 5],
  [1.01, 5.23],
  [1.38, 5.49],
  [1.7, 5.64],
  [2.13, 5.75], // bottom of body
  [2.32, 5.91],
  [2.5, 6.05] // bottom of tip
];

var points = acornPoints.map(function(v, i) {
  return new THREE.Vector3(2.5-v[0],0,v[1]);
});

var acornGeometry = new THREE.LatheGeometry(points, 40);
var acorn = new THREE.SceneUtils.createMultiMaterialObject(acornGeometry, [
  new THREE.MeshPhongMaterial({ color: colors.primary, emissive: colors.emissive}),
  new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0x001100, wireframe: true })
]);
acorn.castShadow = true;
acorn.receiveShadow = false;
acorn.scale.set(5,5,5);
acorn.position.y = 40;
acorn.rotation.x = -300;
scene.add(acorn);

// TEXT
var theText = 'Acorns - Invest the Change.';
var text3d = new THREE.TextGeometry(theText, {
  size: 3,
  height: 1,
  curveSegments: 3,
  font: 'helvetiker',
  bend: true
});

var text = new THREE.SceneUtils.createMultiMaterialObject(text3d, [
  new THREE.MeshPhongMaterial({ color: 0x9a71f6, emissive: colors.emissive}),
  new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0x001100, wireframe: true }),
]);
text.castShadow = true;
text.receiveShadow = false;
text.position.x = -25;
text.position.y = 1;
text.position.z = 0;
scene.add(text);

// CONTROLS
var controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 0.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

// move camera away
camera.position.set(0,60,50);

// AXES (x y z axis lines)
scene.add(buildAxes(1000));

var rotSpeed = 0.01;

// STATS
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

// RENDER function called at every frame repaint
function render() {
  stats.update();
  acorn.rotation.z -= 0.02;

  var x = camera.position.x,
      y = camera.position.y,
      z = camera.position.z;

  camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
  camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
  camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
}

render();
