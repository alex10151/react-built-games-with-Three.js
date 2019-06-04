
import BaseHandler from './BaseHandler';
import * as THREE from 'three';

export default class PlaneHandler extends BaseHandler {
    create(width, height, x, y, z) {
        var plane = new THREE.PlaneGeometry(width, height);
        var normalMaterial = new THREE.MeshNormalMaterial(
        );
        normalMaterial.side = THREE.DoubleSide;
        // var basicMaterial = new THREE.MeshBasicMaterial();
        // basicMaterial.wireframe = true;
        // var lambertMaterial = new THREE.MeshLambertMaterial({
        //     color: '#fff',
        // })
        var mesh = new THREE.Mesh(plane, normalMaterial);
        mesh.rotation.x = x;
        mesh.rotation.y = y;
        mesh.rotation.z = z;
        mesh.position.x = 0;
        mesh.position.y = -1;
        mesh.position.z = 0;
        mesh.name = `plane- + ${this.objCounter}`;
        mesh.receiveShadow = true;
        this.objList.push(mesh);
        this.objCounter++;
        console.log('asdsadsad',mesh);
        return mesh;
    }
}