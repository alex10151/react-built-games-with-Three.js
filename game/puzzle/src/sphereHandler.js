
import BaseHandler from './BaseHandler';
import * as THREE from 'three';
import Physijs from './Physijs/physi';
Physijs.scripts.worker = './Physijs/physijs_worker.js';
Physijs.scripts.ammo = './Physijs/ammo.js';

export default class SphereHandler extends BaseHandler {
    create(radius, widthSeg, heightSeg, axis, position) {
        var sphere = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
        // var Material = new THREE.MeshBasicMaterial({
        //     color: '#d4237a',
        // })
        var material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                color: '#d4237a',
                opacity: 0.8,
                transparent: true
            }),
        )
        var mesh = new Physijs.SphereMesh(sphere, material);
        mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
            console.log('in collide');
        });
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