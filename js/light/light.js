const THREE = require('../libs/three.min.js');
//光
let light = function (scene){
  
  let light1 = new THREE.SpotLight(0xadde8c);
  light1.position.set(40, 40, 40);
  scene.add(light1);

  let light2 = new THREE.DirectionalLight(0xFF0000,.5);
  light2.position.set(-40,40,40);
  scene.add(light2);
} 
export default light;
