import Scene from 'scene/scene.js'
import Renderer from 'renderer/renderer.js'
import Camera from 'camera/camera.js'
import Cube from 'mesh/cube'
import createCube from 'mesh/createCube'
import light from 'light/light.js'
import Player from 'player/player.js'

//暂时引入一下  争取后面删掉
const THREE = require('libs/three.min.js');

class main {
  constructor(){
    this.screenWidth = window.innerWidth;      // 屏幕宽度
    this.screenHeight = window.innerHeight;    // 屏幕高度
    //小游戏里面canvas是自动创建的  不需要再创建一次
    this.ctx = canvas.getContext('webgl');    //获取canvas

    this.cubes = [];  //存方块
    this.scene = new Scene(); //场景
    //相机
    this.camera = new Camera(75, this.screenWidth / this.screenHeight, 0.1, 1000); 
    this.renderer = new Renderer({ context: this.ctx }); //渲染器
    this.jumper = new Player();  //角色
    this.firstCube = {
      cubeColor: 0xff0000,
      cubeWidth: 5,
      cubeHeight: 2,
      cubeDeep: 5,
    };
    //存历史操作
    this.history = [];
    //存一次操作的数据
    this.step;
    //手指是否按着
    this.isTouch;
  }

  //初始化
  init(){
  //创建渲染器
  this.renderer.setClearColor(0xEEEEEE, 1.0);
  this.renderer.setSize(this.screenWidth, this.screenHeight);

  //把渲染器渲染出来的内容添加到body中
  document.body.appendChild(this.renderer.domElement);

  //创建第一个方块
  let cube = new Cube(this.firstCube.cubeWidth, this.firstCube.cubeHeight, this.firstCube.cubeDeep, this.firstCube.cubeColor);
  this.scene.add(cube);
  this.cubes.push(cube);

// 创建下一个方块
  let nextCube = createCube(this.cubes);
  this.scene.add(nextCube);
  this.cubes.push(nextCube);

    let lookAtPoint = new THREE.Vector3();
    lookAtPoint.x = (cube.position.x + nextCube.position.x) / 2;
    lookAtPoint.y = 1;
    lookAtPoint.z = (cube.position.z + nextCube.position.z) / 2;

    //透视投影相机
    this.camera.position.set(cube.position.x+10, 15, cube.position.z+10);
    this.camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);

  //添加光线
    light(this.scene);
    //添加角色
    this.scene.add(this.jumper);
    //添加坐标轴
    // this.axes = new THREE.AxesHelper(30);
    // this.scene.add(this.axes);

    //渲染
    this.render();

      //手指按下
   wx.onTouchStart(e =>{
     this.isTouch = true;
     this.step = {};
     this.jumper.init();
     //开始时间
    this.step.start = e.timeStamp;
    this.handleTouchStart();
   });
  // 手指释放
    wx.onTouchEnd(e => {
    this.isTouch = false;
    //结束时间
    this.step.end = e.timeStamp;
    //计算时间差
    let dif = this.compareTime(this.step.start, this.step.end);
    //跳跃方向
    this.step.dir = this.cubes[this.cubes.length - 1].direcion;
    let dir = (this.step.dir === 'left') ? 'x' : 'z';
    this.step.nextX = this.jumper.position[dir] - this.jumper.xSpeed * dif * 30;

    this.history.push(this.step);

    this.handleTouchEnd();

  });
  }
  //渲染页面
  render(){
    //在渲染器中渲染场景、相机
    this.renderer.render(this.scene, this.camera);
  }

//计算时间差
  compareTime(dStart,dEnd){
    let time = dEnd - dStart;
    // 时间戳转为 天数、时、分、秒
    let t1 = time%(24*3600*1000);
    let t2 = t1%(3600*1000);
    let t3 = t2%(60*1000);
    let sc = (t3 / 1000).toFixed(2);
    // console.log(sc);
    return sc;
  }

  //蓄力动画
  handleTouchStart= ()=>{
    this.jumper.jumpAnim();
    this.render();
    if(this.isTouch)
      requestAnimationFrame(this.handleTouchStart);
  }

  //
  handleTouchEnd=()=>{
    let dir = (this.step.dir === 'left') ? 'x' : 'z';
    // let x = jumper.position[dir] - jumper.xSpeed * dif * 10;

    if (this.jumper.position[dir] > this.step.nextX) {
      // console.log(jumper.position[dir]+' '+step.nextX);
      this.jumper.jump(dir);
      this.render();
      requestAnimationFrame(this.handleTouchEnd);
    } else {
      // console.log('check '+this.jumper.position[dir]);
      this.checkStatus();
    }
  }
  
   //判断是否落在方块上
   checkStatus=()=>{
     if(this.cubes.length>1){
       let player = {
         x: this.jumper.position.x,
         z: this.jumper.position.z
       };
       let curCube = {
         x: this.cubes[this.cubes.length - 2].position.x,
         z: this.cubes[this.cubes.length - 2].position.z,
         w: this.firstCube.cubeWidth,
         direcion: this.cubes[this.cubes.length - 2].direcion
       };
       let nextCube = {
         x: this.cubes[this.cubes.length - 1].position.x,
         z: this.cubes[this.cubes.length - 1].position.z,
         w: this.firstCube.cubeWidth,
         direcion: this.cubes[this.cubes.length - 1].direcion
       };
      //  console.log(player);
      //  console.log(curCube);
      //  console.log(nextCube);
       let dir = (nextCube.direcion === 'left')?'x':'z';
       //还在当前方块上
       let curSafe = curCube[dir] - curCube.w/2;           
       //下一方块的范围
       let nextNear = nextCube[dir] + nextCube.w / 2;
       let nextFar = nextCube[dir] - nextCube.w / 2;
      //  console.log(curSafe+' '+nextNear+' '+nextFar+' '+player[dir]);
       if(player[dir] > curSafe)
        {
          //还在当前方块上 继续 不创建新的方块
          console.log('go on');
       
       } else if (player[dir] < nextNear && player[dir] > nextFar){
         //在下一个方块上
         // 创建下一个方块
         let cube1 = createCube(this.cubes);
         this.scene.add(cube1);
         this.cubes.push(cube1);

        //  把当前jumper位置放到中间
        this.jumper.position.set(nextCube.x,1,nextCube.z);

         let nextCube1 = {
           x: cube1.position.x,
           z: cube1.position.z,
           w: this.firstCube.cubeWidth,
           direcion: cube1.direcion
         };

         //修改相机
         this.camera.updateCamera(curCube, nextCube, nextCube1);
         this.render();
        }else{
          //不在方块上 跌落
         this.jumper.fall();
         this.render();
        }

     }
   }
  updateCamera = (curCube, nextCube, nnCube) => {
    // this.handlerender = render;
    console.log(this);
    let dir1 = nextCube.direcion;
    let dir2 = nnCube.direcion;
    if (dir1 === dir2) {//直线方向
      if (dir1 === 'left') {
        // 左 左
        this.jumper.moveto = {
          x: curCube.x + 5,
          y: 15,
          z: curCube.z - 18
        }
        if (this.jumper.position.x > this.jumper.moveto.x) {
          this.jumper.move();
          this.render();
          //差一个渲染
          requestAnimationFrame(this.jumper.move);
        } else {
          this.position.set(this.moveto.x, this.moveto.y, this.moveto.z);
        }
        // this.move();
        // this.position.set(curCube.x + 5, 15, curCube.z - 18);
      } else {
        //右 右
        this.position.set(curCube.x - 15, 15, curCube.z + 2);
      }
    } else {
      if (dir1 === 'left') {
        //左 右
        this.position.set(curCube.x - 10, 15, curCube.z + 10);
      } else {
        //右 左
        this.position.set(curCube.x + 10, 15, curCube.z);
      }
    }
    //更新相机看向
    this.updateCameraPos(nextCube, nnCube);
  }
  handleMove = ()=>{

  }

  //更新相机位置 当前相机位置  相机下一位置
  // updateCamera(cur, next) {
  //   // console.log(cur);
  //   // console.log(next);
  //   // 如果当前相机位置的x轴大于出现新方块后计算出来的x轴，或者当前相机位置的y轴大于出现新方块后计算出来的y轴,说明要减小相机位置的坐标值了
  //   if (cur.x > next.x || cur.z > next.z) {
  //     this.cameraPos.current.x -= 0.1
  //     this.cameraPos.current.z -= 0.1
  //     // 新相机位置坐标缩减的临界条件
  //     if (this.cameraPos.current.x - this.cameraPos.next.x < 0.05) {
  //       this.cameraPos.current.x = this.cameraPos.next.x
  //     }
  //     if (this.cameraPos.current.z - this.cameraPos.next.z < 0.05) {
  //       this.cameraPos.current.z = this.cameraPos.next.z
  //     }
  //     // 改变相机看向的点
  //     this.camera.lookAt(new THREE.Vector3(this.cameraPos.current.x, 0, this.cameraPos.current.z))
  //     this.render();
  //     requestAnimationFrame(() => {
  //       this.updateCamera(this.cameraPos.current, this.cameraPos.current);
  //     })
  //   }
  // }
   
}

export default main;