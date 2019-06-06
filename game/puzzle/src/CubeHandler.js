
import * as THREE from 'three';
import BaseHandler from './BaseHandler';
import Physijs from './Physijs/physi';
Physijs.scripts.worker = './Physijs/physijs_worker.js';
Physijs.scripts.ammo = './Physijs/ammo.js';
export default class CubeHandler extends BaseHandler {
    create(x, y, z, axis, position, wireframe = true) {
        // var colorCube= scale(Math.random()).hex();
        var geo = new THREE.BoxGeometry(x, y, z);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ffee, wireframe: wireframe });
        var material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                color: 0x00ffee,
                opacity: 0.8,
                transparent: true
            }),
        )
        var cube = {
            object: new Physijs.BoxMesh(geo, material),
            curAxis: { x: axis.x, y: axis.y, z: axis.z },
            name: `cube- + ${this.objCounter++}`,
        }
        cube.object.receiveShadow = true;
        cube.object.position.x = position.x;
        cube.object.position.y = position.y;
        cube.object.position.z = position.z;
        this.objList.push(cube);
        return cube;
    }
}