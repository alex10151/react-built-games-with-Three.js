
import BaseHandler from './BaseHandler';
import * as THREE from 'three';

export default class PlaneHandler extends BaseHandler {
    create(width, height, x, y, z) {
        var plane = new THREE.PlaneGeometry(width, height);
        var normalMaterial = new THREE.MeshNormalMaterial();
        normalMaterial.side = THREE.DoubleSide;
        var basicMaterial = new THREE.MeshBasicMaterial();
        basicMaterial.wireframe = true;
        var mesh = new THREE.Mesh(plane, normalMaterial);
        mesh.rotation.x = 1/2*Math.PI;
        mesh.rotation.y = y;
        mesh.rotation.z = z;
        mesh.position.x = 0;
        mesh.position.y = -5;
        mesh.position.z = 0;
        mesh.name = `plane- + ${this.objCounter}`;
        this.objList.push(mesh);
        this.objCounter++;
        return mesh;
    }
}