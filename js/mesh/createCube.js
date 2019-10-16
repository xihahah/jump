const THREE = require('../libs/three.min.js') ;
import Cube from 'cube'

function createCube(cubes){
  let cubeData = {
    cubeColor: 0xff0000,
    cubeWidth: 5,
    cubeHeight: 2,
    cubeDeep: 5,
  }
  let cube = new Cube(cubeData.cubeWidth, cubeData.cubeHeight, cubeData.cubeDeep, cubeData.cubeColor);
  if(cubes.length){
    let random = Math.random();
    // console.log(random);
    cube.direcion = random > 0.5 ? 'left' : 'right';
    cube.position.x = cubes[cubes.length - 1].position.x;
    cube.position.y = cubes[cubes.length - 1].position.y;
    cube.position.z = cubes[cubes.length - 1].position.z;
    if(cube.direcion === "left"){
      //距离上一个 -4 到 -10的距离
      cube.position.x = cube.position.x - 4*Math.random()-6;
    }else{
      cube.position.z = cube.position.z - 4 * Math.random() - 6;
    }
  }
  
  // console.log(cube);
  return cube;

}

export default createCube;