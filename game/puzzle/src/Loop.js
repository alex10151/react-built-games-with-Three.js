import React from 'react';
import Platform from './Platform';
import './Loop.css';
import CubeHandler from './CubeHandler';
import * as THREE from 'three';
import * as rxjs from 'rxjs';
import * as operator from 'rxjs/operators';
export default class Loop extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.setRef = this.setRef.bind(this);
        this.keyProcess = this.keyProcess.bind(this);
        this.keyUpProcess = this.keyUpProcess.bind(this);
        this.translate = this.translate.bind(this);
        this.translator = this.translator.bind(this);
        this.KeyEventKernel = this.KeyEventKernel.bind(this);
        this.keyUpEventKernel = this.keyUpEventKernel.bind(this);
        this.jump = this.jump.bind(this);

        document.onkeypress = this.keyProcess;
        document.onkeyup = this.keyUpProcess;

        this.timeline = 0;
        this.translateInterval = 200;
        this.intervalJump = null;
        this.jumpFunc = (x) => -2 * x + 2;

        this.$keySubject = new rxjs.Subject();
        this.keyObservable$ = this.$keySubject.asObservable();
        this.$keyUpSubject = new rxjs.Subject();
        this.keyUpObservable$ = this.$keyUpSubject.asObservable();
        this.$stop = new rxjs.Subject();
        // this.curAxis = { x: 0, y: 0, z: 1 };
    }
    createPlatform() {
        return new Platform(new CubeHandler());
    }
    addToScene(platform, scene, translateFunc = (item) => item) {
        platform.cubeHandler.cubeList.map(translateFunc).map((cube) => {
            scene.add(cube.cube)
        });
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
        console.log('camera', this.camera);
    }
    componentDidMount() {
        this.initRenderer();
        this.platform = this.createPlatform();
        this.platform.createCube(1, 1, 1, { x: 0, y: 0, z: 0 }, true);
        this.keyObservable$.subscribe(this.KeyEventKernel);
        this.keyUpObservable$.subscribe(this.keyUpEventKernel);
        this.addToScene(this.platform, this.scene, this.translator);
        this.animate();
    }
    setRef(element) {
        this.canvasRef = element;
    }
    animate() {
        this.timeline++;
        // if (this.timeline === 10000) {
        //     clearTimeout(this.timeOut);
        //     return;
        // }
        // this.platform.createCube(1, 1, 1, { x: 0, y: 0, z: 0 });
        // this.addToScene(this.platform, this.scene, this.translator);
        if (this.platform.cubeHandler.cubeList.length === 3) {
            this.scene.remove(...this.platform.cubeHandler.popCubes(1).map(cube => cube.cube));
        }
        this.camera.lookAt(this.platform.cubeHandler.cubeList[0].cube.position);
        // this.renderer2.render(this.scene, this.camera);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
        // this.timeOut = setTimeout(this.animate, 1000);
    }
    translate(translator) {
        this.platform.cubeHandler.cubeList = this.platform.cubeHandler.cubeList.map(translator);
        return this.platform.cubeHandler.cubeList;
    }
    translator(cubeItem) {
        if (cubeItem) {
            this.translatorWithValue(cubeItem, this.translateInterval / 100);
        }

        return cubeItem;
    }
    translatorWithValue(cubeItem, value) {
        return cubeItem.cube.translateOnAxis(cubeItem.curAxis, value);
    }
    keyProcess(event) {
        // console.log('in process',event);
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

                // this.resetAxis(this.platform.cubeHandler.cubeList[0]);   
                var y = jumpFunc(x);
                // var y = (x => Math.cos(x))(x);
                // console.log('in subs', x, y,Math.abs(this.platform.cubeHandler.cubeList[0].cube.position.y - 0) );

                
                // if (y < 0 && Math.abs(cube.cube.position.y - 0) < 1) {
                //     cube.cube.position.y = 0;
                //     this.$stop.next();
                //     this.intervalJump = null;
                //     return null;
                // }
                
                // downside detection
                this.increaseAxis(cube.curAxis, [y], false, true);
                this.translatorWithValue(cube, value);
                if(cube.cube.position.y<0){
                    cube.cube.position.y = 0;
                    this.$stop.next();
                    this.intervalJump = null;
                    return null;
                }

            }
        );
    }
    resetAxis(axis) {
        axis.x = 0;
        axis.y = 0;
        axis.z = 0;
    }
    increaseAxis(axis, value, isSetX = true, isSetY = false, isSetZ = false) {
        if (value instanceof Array && value.length > 0 && value.length <= 3) {
            if (value.length === 1) {
                if (isSetX) {
                    axis.x += value[0];
                }
                if (isSetY) {
                    axis.y += value[0];
                }
                if (isSetZ) {
                    axis.z += value[0];
                }
            }
            else if (value.length === 2) {
                if (isSetX) {
                    axis.x += value[0];
                }
                if (isSetY) {
                    axis.y += value[1];
                }
            }
            else {
                if (isSetX) {
                    axis.x += value[0];
                }
                if (isSetY) {
                    axis.y += value[1];
                }
                if (isSetZ) {
                    axis.z += value[2];
                }
            }
        }
    }
    keyUpEventKernel(key) {
        if (key === 'a') {
            this.resetAxis(this.platform.cubeHandler.cubeList[0].curAxis);
        }
        if (key === 'd') {
            this.resetAxis(this.platform.cubeHandler.cubeList[0].curAxis);
        }
        if (key === ' ') {
            if (this.intervalJump === null) {
                this.platform.cubeHandler.cubeList[0].curAxis.y = 0;
                console.log('in kernel', this.platform.cubeHandler.cubeList[0].cube);
            }

        }
    }
    KeyEventKernel(key) {

        if (key === 'a') {
            this.increaseAxis(this.platform.cubeHandler.cubeList[0].curAxis, [-0.2]);
            this.translator(this.platform.cubeHandler.cubeList[0]);
        }
        if (key === 'd') {
            this.increaseAxis(this.platform.cubeHandler.cubeList[0].curAxis, [0.2]);
            this.translator(this.platform.cubeHandler.cubeList[0]);
        }
        if (key === 'w') {
            this.camera.position.z += 1;
        }
        if (key === 's') {
            this.camera.position.z -= 1;
        }
        if (key === ' ') {
            this.jump(this.platform.cubeHandler.cubeList[0], 0.5, this.jumpFunc, 30);
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