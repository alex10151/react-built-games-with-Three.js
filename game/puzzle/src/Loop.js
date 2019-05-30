import React from 'react';
import Platform from './Platform';
import './Loop.css';
import CubeHandler from './CubeHandler';
import * as THREE from 'three';
import * as rxjs from 'rxjs';
import * as operator from 'rxjs/operators';
import PlaneHandler from './PlaneHandler';
import { increaseAxis, resetAxis } from './utils';
export default class Loop extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.setRef = this.setRef.bind(this);
        this.keyProcess = this.keyProcess.bind(this);
        this.keyUpProcess = this.keyUpProcess.bind(this);
        this.KeyEventKernel = this.KeyEventKernel.bind(this);
        this.keyUpEventKernel = this.keyUpEventKernel.bind(this);
        this.jump = this.jump.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);

        // document.onkeypress = this.keyProcess;
        document.onkeydown = this.keyProcess;
        document.onkeyup = this.keyUpProcess;

        this.timeline = 0;
        this.translateInterval = 200;
        this.intervalJump = null;
        this.jumpFunc = (x) => -2 * x + 2;

        this.$keySubject = new rxjs.Subject();
        this.keyObservable$ = this.$keySubject.asObservable().pipe(operator.debounceTime(100));
        this.$keyUpSubject = new rxjs.Subject();
        this.keyUpObservable$ = this.$keyUpSubject.asObservable().pipe(operator.debounceTime(100));
        this.$stop = new rxjs.Subject();
        // this.curAxis = { x: 0, y: 0, z: 1 };
    }
    createPlatform() {
        return new Platform(new CubeHandler(), new PlaneHandler());
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
        // this.camera = new THREE.OrthographicCamera(window.innerWidth / 16, window.innerWidth / 16, window.innerWidth / 16, window.innerWidth / 16, -200, 500);
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        console.log('camera', this.camera);
    }
    componentDidMount() {
        this.initRenderer();
        this.platform = this.createPlatform();
        this.mainPlane = this.platform.createPlane(30, 300, 0, 0, 0);
        console.log('111', this.mainPlane, this.platform);
        this.mainObj = this.platform.createCube(1, 1, 1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false);
        //test obstacle
        // this.generateObstacles(1);
        this.keyObservable$.subscribe(this.KeyEventKernel);
        this.keyUpObservable$.subscribe(this.keyUpEventKernel);
        this.platform.translateMany('cube',
            (cubeItem) => this.platform.translatorWithValue(cubeItem.cube, cubeItem.curAxis, this.translateInterval / 100));
        this.platform.addToSceneMany('cube', this.scene);
        this.platform.addToSceneMany('plane', this.scene);
        this.animate();
    }
    setRef(element) {
        this.canvasRef = element;
    }
    animate() {
        this.timeline++;
        if (this.timeline === 10) {
            this.platform.generateObstacles(100);

        }
        this.platform.addToSceneMany('cube', this.scene);
        // this.generateObstacles(10);
        // this.platform.addToSceneMany('cube', this.scene);
        // console.log('2222',this.platform);
        // if (this.platform.cubeHandler.objList.length === 3) {
        //     this.scene.remove(...this.platform.popCubes(1).map(cube => cube.cube));
        // }
        // this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }
    keyProcess(event) {
        event.preventDefault();
        return this.$keySubject.next(event.key);
    }
    keyUpProcess(event) {
        event.preventDefault();
        return this.$keyUpSubject.next(event.key);
    }

    jump(cube, value, jumpFunc, interval) {
        if (this.intervalJump !== null) {
            // this.intervalJump.unsubscribe();
            return null;
        }
        this.intervalJump = rxjs.interval(interval).pipe(
            // operator.take(20),
            operator.takeUntil(this.$stop),
            // operator.map(x => x / 50 * 2 * Math.PI),
        ).subscribe(
            x => {
                var y = jumpFunc(x);

                // downside detection
                increaseAxis(cube.curAxis, [y], false, true);
                this.platform.translatorWithValue(cube.cube, cube.curAxis, value);
                if (cube.cube.position.y < 0) {
                    cube.cube.position.y = 0;
                    this.$stop.next();
                    this.intervalJump = null;
                    return null;
                }

            }
        );
    }
    keyUpEventKernel(key) {
        if (key === 'a') {
            resetAxis(this.mainObj.curAxis);
        }
        if (key === 'd') {
            resetAxis(this.mainObj.curAxis);
        }
        if (key === ' ') {
            if (this.intervalJump === null) {
                this.mainObj.curAxis.y = 0;
            }

        }
    }
    KeyEventKernel(key) {

        if (key === 'a') {
            increaseAxis(this.mainObj.curAxis, [-0.2]);
            this.platform.translatorWithValue(this.mainObj.cube, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === 'd') {
            increaseAxis(this.mainObj.curAxis, [0.2]);
            this.platform.translatorWithValue(this.mainObj.cube, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === 'w') {
            this.camera.position.z += 1;
        }
        if (key === 's') {
            this.camera.position.z -= 1;
        }
        if (key === ' ') {
            this.jump(this.mainObj, 0.5, this.jumpFunc, 30);
        }
        // this.renderer.render(this.scene, this.camera);
    }
    render() {
        return (

            <div ref={this.setRef}>
                <h1>this is the main canvas:</h1>
            </div>);
    };
}