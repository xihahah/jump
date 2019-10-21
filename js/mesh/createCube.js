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
    cube.direcion = random > 0.5 ? 'left' : 'right';
    cube.position.x = cubes[cubes.length - 1].position.x;
    cube.position.y = cubes[cubes.length - 1].position.y;
    cube.position.z = cubes[cubes.length - 1].position.z;
    if(cube.direcion === "left"){
      //距离上一个 -6 到 -12的距离
      cube.position.x = cube.position.x - Math.round(6 * Math.random()) - 6;
    }else{
      cube.position.z = cube.position.z - Math.round(6 * Math.random()) - 6;
    }
  }

  return cube;

}

export default createCube;