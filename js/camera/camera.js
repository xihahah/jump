const THREE = require('../libs/three.min.js');
//透视投影相机
class Camera extends THREE.PerspectiveCamera {
  //计算相机看向的点  传入 当前方块 和 下一方块
  updateCameraPos = (cur, next) => {
    let lookAtPoint = new THREE.Vector3();
    lookAtPoint.x = (cur.x + next.x)/2;
    lookAtPoint.y = 1;
    lookAtPoint.z = (cur.z + next.z)/2;
    this.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
  }
  updateCamera = (curCube, nextCube, nnCube) => {
    let dir1 = nextCube.direcion;
    let dir2 = nnCube.direcion;
    if (dir1 === dir2) {//直线方向
      if (dir1 === 'left') {
        // 左 左
        // this.moveto = {
        //   x: curCube.x + 5,
        //   y: 15,
        //   z: curCube.z - 18
        // }
        // this.move();
        this.position.set(curCube.x + 10, 15, curCube.z + 10);
      } else {
        //右 右
        this.position.set(curCube.x + 10, 15, curCube.z + 10);
        // this.position.set(curCube.x - 15, 15, curCube.z + 2);
      }
    } else {
      if (dir1 === 'left') {
        //左 右
        this.position.set(curCube.x + 10, 15, curCube.z + 10);
        // this.position.set(curCube.x - 10, 15, curCube.z + 10);
      } else {
        //右 左
        this.position.set(curCube.x + 10, 15, curCube.z + 10);
        // this.position.set(curCube.x + 10, 15, curCube.z);
      }
    }
    //更新相机看向
    this.updateCameraPos(nextCube, nnCube);
  }
  move = ()=>{
    console.log('move');
    let x = this.position.x;
    let y = this.position.y;
    let z = this.position.z;
    if (this.position.x > this.moveto.x){
      x += 0.5;
      z += 0.5;
      this.position.set(x, this.moveto.y, z);
      //差一个渲染
      requestAnimationFrame(this.move);
    }else{
      this.position.set(this.moveto.x, this.moveto.y, this.moveto.z);
    }
    
  }
  // cameraMove = () => {
  //   let x = this.position.x;
  //   let z = this.position.z;
  //   if (this.position.x > x1) {
  //     this.camera.move();
  //     this.render();
  //     requestAnimationFrame(this.cameraMove);
  //   } else {
  //     this.position.set(x1, y, z1);
  //   }
  // }
}
export default Camera;