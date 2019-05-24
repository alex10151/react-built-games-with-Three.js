
import * as THREE from 'three';
export default class CubeHandler {
    constructor() {
        this.cubeList = [];
        this.cubeCounter = 0;
    }
    createCube(x, y, z, axis, wireframe = true) {
        var geo = new THREE.BoxGeometry(x, y, z);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wireframe });
        var cube = new THREE.Mesh(geo, material);
        cube.name = 'cube-' + this.cubeCounter++;
        this.cubeList.push({
            cube: cube,
            curAxis: { x: axis.x, y: axis.y, z: axis.z },
        }
        );
        return this.cubeList[this.cubeList.length + 1];
    }
    removeCube(name) {
        this.cubeList = this.cubeList.filter((cube => cube.cube.name !== name));
    }
    popCubes(number) {
        return this.cubeList.splice(0, number);
    }
}