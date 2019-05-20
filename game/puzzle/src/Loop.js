import React from 'react';
import Platform from './Platform';
import './Loop.css';
import CubeHandler from './CubeHandler';
import * as THREE from 'three';
export default class Loop extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.setRef = this.setRef.bind(this);
        this.timeline = 0;
    }
    createPlatform() {
        return new Platform(new CubeHandler());
    }
    addToScene(platform, scene) {
        platform.cubeHandler.cubeList.map((cube) => cube.cube.translateOnAxis({x:0,y:0,z:1},-(cube.translateZ+this.timeline)
        )).map((cube) => scene.add(cube));
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            // canvas: this.canvasRef,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvasRef.appendChild(this.renderer.domElement);
        // this.renderer2 = new THREE.WebGLRenderer();
        // document.body.appendChild(this.renderer2.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 2;
    }
    componentDidMount() {
        this.initRenderer();
        this.platform = this.createPlatform();
        this.platform.createCube();
        console.log('in did mount', this.platform.cubeHandler);
        this.addToScene(this.platform, this.scene);
        this.animate();
    }
    setRef(element) {
        this.canvasRef = element;
    }
    animate() {
        this.timeline++;
        if(this.timeline===10){
            clearTimeout(this.timeOut);
            return ;
        }
        this.platform.createCube(1,1,1);
        this.addToScene(this.platform, this.scene);
        if (this.platform.cubeHandler.cubeList.length === 2) {
            console.log('asdsadsad');
            this.scene.remove(...this.platform.cubeHandler.popCubes(1).map(cube=>cube.cube));
        }
        // this.renderer2.render(this.scene, this.camera);
        this.renderer.render(this.scene, this.camera);
        // requestAnimationFrame(this.animate);
        this.timeOut = setTimeout(this.animate, 300);
    }

    render() {
        return (<div ref={this.setRef}>
            <h1>this is the main canvas:</h1>
        </div>);
    };
}