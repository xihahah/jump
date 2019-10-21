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
    this.screenWidth = window.innerWidth;      // 屏幕宽宽
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
  // //创建场景
  // scene = new Scene();
  init(){
    console.log(this);
  //透视投影相机
  this.camera.position.set(20, 20, 30);
  this.camera.lookAt(this.scene.position);

  //创建渲染器
  // renderer = new Renderer({ context: ctx });
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

  //添加光线
    light(this.scene);
    //添加角色
    this.scene.add(this.jumper);
    //添加坐标轴
    this.axes = new THREE.AxesHelper(30);
    this.scene.add(this.axes);

    //渲染
    this.render();
    let that = this;
    // console.log(that);
      //手指按下
   wx.onTouchStart(e =>{
     console.log(that.jumper);
     this.isTouch = true;
     this.step = {};
     that.jumper.init();
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


  handleTouchEnd=()=>{
    let dir = (this.step.dir === 'left') ? 'x' : 'z';
    // let x = jumper.position[dir] - jumper.xSpeed * dif * 10;

    if (this.jumper.position[dir] > this.step.nextX) {
      // console.log(jumper.position[dir]+' '+step.nextX);
      this.jumper.jump(dir);
      this.render();
      requestAnimationFrame(this.handleTouchEnd);
    } else {
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
         w: this.firstCube.cubeWidth
       };
       let nextCube = {
         x: this.cubes[this.cubes.length - 1].position.x,
         z: this.cubes[this.cubes.length - 1].position.z,
         w: this.firstCube.cubeWidth
       };
       let dir = (player.direcion === 'left')?'x':'z';
       let curSafe = curCube[dir] - curCube.w/2;
       let nextNear = nextCube[dir] + nextCube.w / 2;
       let nextFar = nextCube[dir] - nextCube.w / 2;
       console.log(curSafe+' '+nextNear+' '+nextFar+' '+player[dir]);
       if(player[dir] < curSafe && player[dir] > nextNear)
        {
         this.jumper.fall();
         this.render();
        }else if(player[dir] < nextFar){
         this. jumper.fall();
         this.render();
        }else{
         // 创建下一个方块
         let cube1 = createCube(this.cubes);
         this.scene.add(cube1);
         this.cubes.push(cube1);
         this.render();
        }

     }
   }
}

export default main;