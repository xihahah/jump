import Scene from 'scene/scene.js'
import Renderer from 'renderer/renderer.js'
import Camera from 'camera/camera.js'
import Cube from 'mesh/cube'
import createCube from 'mesh/createCube'
import light from 'light/light.js'
import Player from 'player/player.js'

function main() {
   //暂时引入一下  争取后面删掉
  const THREE = require('libs/three.min.js');

  
  const screenWidth = window.innerWidth;      // 屏幕宽宽
  const screenHeight = window.innerHeight;    // 屏幕高度
  //小游戏里面canvas是自动创建的  不需要再创建一次
  const ctx = canvas.getContext('webgl');    //获取canvas

  let timer = null; //触摸事件定时器
  let cubes = [];  //存方块
  let scene; //场景
  let camera;  //相机
  let renderer; //渲染器
  let jumper;  //角色
  const firstCube = {
    cubeColor: 0xff0000,
    cubeWidth: 5,
    cubeHeight: 2,
    cubeDeep: 5,
  }

  //创建场景
  scene = new Scene();

  //透视投影相机
  camera = new Camera(75, screenWidth / screenHeight, 0.1, 1000);
  camera.position.set(20, 20, 30);
  camera.lookAt(scene.position);

  //创建渲染器
  renderer = new Renderer({ context: ctx });
  renderer.setClearColor(0xEEEEEE, 1.0);
  renderer.setSize(screenWidth, screenHeight);

  //把渲染器渲染出来的内容添加到body中
  document.body.appendChild(renderer.domElement);

  

  //创建第一个方块
  let cube = new Cube(firstCube.cubeWidth, firstCube.cubeHeight, firstCube.cubeDeep, firstCube.cubeColor);
  scene.add(cube);
  cubes.push(cube);

// 创建下一个方块
  let nextCube = createCube(cubes);
  scene.add(nextCube);
  cubes.push(nextCube);


  //添加光线
  light(scene);

  //渲染页面
  let render = ()=>{
    //在渲染器中渲染场景、相机
    renderer.render(scene, camera);
  }

  //添加角色
  jumper = new Player();
  scene.add(jumper);

  //添加坐标轴
  let axes = new THREE.AxesHelper(30);
  scene.add(axes);

  //渲染
  render();

  //手指按下
   wx.onTouchStart(function (){
     timer = setInterval(()=>{
       if(jumper.scale.y > 0.2){
         jumper.jumpAnim();
         render();
       }
     },100)
    //  console.log(jumper);
   });

   //手指释放
   wx.onTouchEnd(function () {
     clearInterval(timer);
     timer = setInterval(()=>{
       let stop = jumper.down();
       render();
       if(!stop) {
         clearInterval(timer);
         timer = null;
         }
     },100)
   });

}

export default main;