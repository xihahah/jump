import Cube from '../mesh/cube.js'
const THREE = require('../libs/three.min.js');
const config = {
  width: 1,
  height: 2,
  deep: 1,
  color: 0x000000
}
class Player extends THREE.Mesh{
  constructor(){
    let material = new THREE.MeshLambertMaterial({
      color: config.color
    })
    let geometry = new THREE.CubeGeometry(config.width, config.height, config.deep);
    
    //向上平移1个单位
    geometry.translate(0,1,0);

    super(geometry,material);
   
    //再把y的位置设为1   使得中心点在底部
    this.position.y = 1;
    
    //设置水平、竖直方向的速度
    this.xSpeed = .004;
    this.ySpeed = .008;
  }
  //蓄力动画
  jumpAnim = () => {
      this.scale.y -= .05;
  }
  //落下
  down = ()=>{
    if(this.scale.y < 1){
      this.scale.y += .1;
      return true;
    } else {
      return false;
    }
  }
}
export default Player;