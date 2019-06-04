import React from 'react';
import Platform from './Platform';
import './Loop.css';
import CubeHandler from './CubeHandler';
import * as THREE from 'three';
import * as rxjs from 'rxjs';
import * as operator from 'rxjs/operators';
import PlaneHandler from './PlaneHandler';
import { increaseAxis, resetAxis } from './utils';
import SphereHandler from './sphereHandler';
import { TimelineMax } from 'gsap/TweenMax';
export default class Loop extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.setRef = this.setRef.bind(this);
        this.keyProcess = this.keyProcess.bind(this);
        this.keyUpProcess = this.keyUpProcess.bind(this);
        this.KeyEventKernel = this.KeyEventKernel.bind(this);
        this.keyUpEventKernel = this.keyUpEventKernel.bind(this);
        this.setCamera = this.setCamera.bind(this);
        this.initLight = this.initLight.bind(this);
        this.jump = this.jump.bind(this);
        this.jumpNew = this.jumpNew.bind(this);
        this.control = this.control.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);

        // document.onkeypress = this.keyProcess;
        document.onkeydown = this.keyProcess;
        document.onkeyup = this.keyUpProcess;


        this.translateInterval = 200;
        this.intervalJump = null;
        this.jumpTimeLine = null;
        this.mainRollTimeLine = null;
        this.mainControlTimeLine = null;
        this.rollTimeout = null;
        // this.jumpFunc = (x) => -2 * x + 1;
        this.jumpFunc = (x) => Math.cos(1 / Math.PI * x);

        this.$keySubject = new rxjs.Subject();
        this.keyObservable$ = this.$keySubject.asObservable().pipe(operator.debounceTime(100));
        this.$keyUpSubject = new rxjs.Subject();
        this.keyUpObservable$ = this.$keyUpSubject.asObservable().pipe(operator.debounceTime(100));
        this.$stop = new rxjs.Subject();
        // this.curAxis = { x: 0, y: 0, z: 1 };
    }
    createPlatform() {
        return new Platform(new CubeHandler(), new PlaneHandler(), new SphereHandler());
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            // canvas: this.canvasRef,
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvasRef.appendChild(this.renderer.domElement);
        // this.renderer2 = new THREE.WebGLRenderer();
        // document.body.appendChild(this.renderer2.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera = new THREE.OrthographicCamera(window.innerWidth / 16, window.innerWidth / 16, window.innerWidth / 16, window.innerWidth / 16, -200, 500);
        this.setCamera({ x: -30, y: 30, z: 30 });
        this.camera.lookAt(0, 0, 10);
        console.log('camera', this.camera);
    }
    initLight() {
        var ambient = new THREE.AmbientLight(0x0c0c0c);
        var spot = new THREE.SpotLight(0xffffff);
        spot.position.set(-40, 60, -10);
        spot.castShadow = true;
        spot.shadow.mapSize.width = 2048;
        spot.shadow.mapSize.height = 2048;
        this.scene.add(ambient);
        this.scene.add(spot);
    }
    setCamera(position) {
        this.camera.position.x = position.x;
        this.camera.position.y = position.y;
        this.camera.position.z = position.z;
    }
    componentDidMount() {
        this.initRenderer();
        this.initLight();
        this.loopCounter = 0;
        this.platform = this.createPlatform();
        this.mainPlane = this.platform.createPlane(30, 300, 1 / 2 * Math.PI, 0, 0);
        // this.mainObj = this.platform.createCube(1, 1, 1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false);
        this.mainObj = this.platform.createSphere(0.5, 100, 100, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        //test obstacle
        // this.generateObstacles(1);
        this.keyObservable$.subscribe(this.KeyEventKernel);
        this.keyUpObservable$.subscribe(this.keyUpEventKernel);

        this.platform.addToSceneMany('plane', this.scene);
        this.platform.addToSceneMany('sphere', this.scene);
        this.animate();
    }
    setRef(element) {
        this.canvasRef = element;
    }
    animate() {
        this.loopCounter++;
        if (this.loopCounter === 10)
            this.platform.generateObstacles(100, (mesh) => this.platform.createAnimation(mesh, 'roll'));
        this.platform.addToSceneMany('cube', this.scene);

        if (!this.rollTimeout && !this.mainRollTimeLine && this.mainObj.object.position.y === 0) {
            this.rollTimeout = setTimeout(() => {
                this.mainRollTimeLine = this.roll(this.mainObj);
                this.rollTimeout = null;
            }, 2000);
        }

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
    jumpNew(obj) {
        return this.platform.createAnimation(obj.object, 'jump');
    }
    roll(obj) {
        return this.platform.createAnimation(obj.object, 'roll');
    }
    control(obj, type) {
        return this.platform.createAnimation(obj.object, 'control', type);
    }
    jump(obj, value, jumpFunc, interval) {
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
                increaseAxis(obj.curAxis, [y], false, true);
                this.platform.translatorWithValue(obj.object, obj.curAxis, value);
                if (obj.object.position.y < 0 || ((y < 0 && Math.abs(obj.object.position.y - 0.5) < 0))) {
                    obj.object.position.y = 0;
                    this.$stop.next();
                    this.intervalJump = null;
                    return null;
                }

            }
        );
    }
    keyUpEventKernel(key) {
        if (key === 'a' || key === 'd' || key === 'w' || key === 's') {
            resetAxis(this.mainObj.curAxis);
        }
        if (key === ' ') {
            if (this.intervalJump === null) {
                this.mainObj.curAxis.y = 0;
            }

        }
    }
    KeyEventKernel(key) {

        if (this.mainRollTimeLine) {
            this.mainRollTimeLine.kill();
            this.mainRollTimeLine = null;
        }
        if (this.mainControlTimeLine) {
            this.mainControlTimeLine.kill();
            this.mainControlTimeLine = null;
        }
        if (key === 'a') {

            this.mainControlTimeLine = this.control(this.mainObj, 'a');
            // increaseAxis(this.mainObj.curAxis, [-0.3]);
            // this.platform.translatorWithValue(this.mainObj.object, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === 'd') {
            this.mainControlTimeLine = this.control(this.mainObj, 'd');
            // increaseAxis(this.mainObj.curAxis, [0.3]);
            // this.platform.translatorWithValue(this.mainObj.object, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === 'w') {
            // this.camera.position.z += 1;
            this.mainControlTimeLine = this.control(this.mainObj, 'w');
            // increaseAxis(this.mainObj.curAxis, [-0.3], false, false, true);
            // this.platform.translatorWithValue(this.mainObj.object, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === 's') {
            this.mainControlTimeLine = this.control(this.mainObj, 's');
            // this.camera.position.z -= 1;
            // increaseAxis(this.mainObj.curAxis, [0.3], false, false, true);
            // this.platform.translatorWithValue(this.mainObj.object, this.mainObj.curAxis, this.translateInterval / 100);
        }
        if (key === ' ') {
            if (this.jumpTimeLine)
                return null;
            this.jumpTimeLine = this.jumpNew(this.mainObj);
            this.jumpTimeLine.addCallback(() => this.jumpTimeLine = null);
            // this.mainObjRollTimeLine = this.roll(this.mainObj);

            // this.jump(this.mainObj, 0.2, this.jumpFunc, 100);
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