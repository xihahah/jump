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
    
  }
  //参数初始化
  init = ()=>{
    //设置水平、竖直方向的速度
    this.xSpeed = .3;
    this.ySpeed = 1;
  }
  //蓄力动画
  jumpAnim = () => {
    if (this.scale.y > 0.2) {
      this.scale.y -= .008;
    }
  }
  //跳跃
  jump = (dir)=>{
    //恢复原状
    if (this.scale.y < 1) 
      this.scale.y += .1;

    // //竖直方向
    // this.position.y += this.ySpeed;
    // if (this.position.y !== 1) {
    //   this.ySpeed -= .5
    //   if(this.position.y < 1)
    //   this.position.y = 1;
    // }
      
    //水平方向
    this.position[dir] -= this.xSpeed;
    
  }
  //掉落
  fall = ()=>{
    console.log('jumper fall');
    this.position.y = 0;
  }
}
export default Player;