
import * as THREE from 'three';
import BaseHandler from './BaseHandler';
export default class CubeHandler extends BaseHandler {
    create(x, y, z, axis, position, wireframe = true) {
        var geo = new THREE.BoxGeometry(x, y, z);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ffee, wireframe: wireframe });
        var cube = {
            cube: new THREE.Mesh(geo, material),
            curAxis: { x: axis.x, y: axis.y, z: axis.z },
            name: `cube- + ${this.objCounter++}`,
        }
        cube.cube.position.x = position.x;
        cube.cube.position.y = position.y;
        cube.cube.position.z = position.z;
        this.objList.push(cube);
        return cube;
    }
}