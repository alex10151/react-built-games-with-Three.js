
import * as THREE from 'three';
export default class CubeHandler {
    constructor() {
        this.cubeList = [];
        this.cubeCounter = 0;
    }
    createCube(x, y, z) {
        var geo = new THREE.BoxGeometry(x, y, z);
        var material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true });
        var cube = new THREE.Mesh(geo, material);
        cube.name = 'cube-' + this.cubeCounter++;
        this.cubeList.push({
            cube:cube,
            translateX:0,
            translateY:0,
            translateZ:0,
        }
            );
        return cube;
    }
    removeCube(name) {
        this.cubeList = this.cubeList.filter((cube => cube.cube.name !== name));
    }
    popCubes(number) {
        console.log('in popup',this.cubeList);
        return this.cubeList.splice(0, number);
    }
}