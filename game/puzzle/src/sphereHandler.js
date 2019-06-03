
import BaseHandler from './BaseHandler';
import * as THREE from 'three';

export default class SphereHandler extends BaseHandler {
    create(radius, widthSeg, heightSeg, axis, position) {
        var sphere = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
        var Material = new THREE.MeshBasicMaterial({
            color: '#d4237a',
        })
        var mesh = new THREE.Mesh(sphere, Material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.receiveShadow = true;
        var sphereObj = {
            object: mesh,
            curAxis: { x: axis.x, y: axis.y, z: axis.z },
            name: `sphere- + ${this.objCounter}`,
        }
        this.objList.push(sphereObj);
        this.objCounter++;
        return sphereObj;
    }
}