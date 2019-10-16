// import {Mesh} from '../libs/three.min.js';
const THREE = require('../libs/three.min.js');
//模型类 
class Cube extends THREE.Mesh {
  //长 高 宽 颜色
  constructor(width, height, deep, color){
    let geometry = new THREE.BoxGeometry(width,height,deep);
    let material = new THREE.MeshPhongMaterial({
      color: color
    });
    super(geometry,material);
  }
}

export default Cube;