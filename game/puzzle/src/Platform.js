
import { TimelineMax, Bounce, Power1 } from "gsap/TweenMax";
export default class Platform {
    constructor(cubeHandler, planeHandler, sphereHandler) {
        this.cubeHandler = cubeHandler;
        // this.pathHandler = pathHandler;
        this.planeHandler = planeHandler;
        this.sphereHandler = sphereHandler;
    }
    createAnimation(mesh, type, direction) {
        var jumpAnimation = (mesh) => {
            var tl = new TimelineMax({
                yoyo: true
            });

            tl.to(mesh.position, 0.5, {
                y: 5,
                ease: Power1.easeOut,
            })
            tl.to(mesh.position, 1, {
                y: 0,
                ease: Bounce.easeOut,
                // onComplete: rollAnimation,
                // onCompleteParams: [mesh, 'roll'],
            })
            return tl;
        }
        var controlAnimation = (mesh, direction) => {
            var tl = new TimelineMax({
                // yoyo: trues
            });
            var ease = Power1.easeInOut;
            var config = {
                ease: ease,
                // onComplete: rollAnimation,
                // onCompleteParams: [mesh],
            }
            direction === 'a' ? (config.x = mesh.position.x - 5) : ((direction === 'd') ?
                (config.x = mesh.position.x + 5) : ((direction === 'w') ? (config.z = mesh.position.z - 5) : (config.z = mesh.position.z + 5)));
            tl.to(mesh.position, 1, config);
            return tl;
        }
        var rollAnimation = (mesh) => {
            var tl = new TimelineMax({
                // yoyo: trues
            });

            tl.to(mesh.position, 5, {
                z: 50,
                // ease: Bounce.easeOut,
                ease: Power1.easeIn,
            })
            return tl;
        }
        if (type === 'jump') {
            return jumpAnimation(mesh);
        }
        if (type === 'roll') {
            return rollAnimation(mesh);
        }
        if (type === 'control' && (direction === 'a' || 'w' || 'd' || 's')) {
            return controlAnimation(mesh, direction);
        }
    }

    generateObstacles(number, animateFunc) {
        return Array.from({ length: number }).map(
            (x) => setTimeout(() => {
                var obstacle = this.createCube(1, 1, 1,
                    {
                        x: 0,
                        y: 0,
                        z: -1,
                    },
                    {
                        x: Math.random() * 10 - 5,
                        y: 0,
                        z: -Math.random() * 30,
                    },
                    false);
                animateFunc(obstacle.object);
            }, Math.random() * 100000)

        );
    }
    translateMany(name, translateFunc) {
        if (name === 'cube') {
            return this.cubeHandler.objList.map(translateFunc);
        }
        // if (name === 'path') {
        //     return this.pathHandler.objList.map(translateFunc);
        // }

        if (name === 'plane') {
            return this.planeHandler.objList.map(translateFunc);
        }
        if (name === 'sphere') {
            return this.sphereHandler.objList.map(translateFunc);
        }
    }
    addToSceneMany(name, scene) {
        if (name === 'cube') {
            return this.cubeHandler.objList.map((cube) =>
                scene.add(cube.object)
            );
        }
        // if (name === 'path') {
        //     return this.pathHandler.objList.map((obj) =>
        //         scene.add(obj)
        //     );
        // }
        if (name === 'plane') {
            return this.planeHandler.objList.map((obj) =>
                scene.add(obj)
            );
        }
        if (name === 'sphere') {
            return this.sphereHandler.objList.map((shpere) =>
                scene.add(shpere.object));
        }
    }
    createPlane(width, height, x, y, z) {
        return this.planeHandler.create(width, height, x, y, z);
    }
    createCube(x = 1, y = 1, z = 1, axis, position, wired = true) {
        if (this.cubeHandler)
            return this.cubeHandler.create(x, y, z, axis, position, wired);
    }
    createSphere(radius, widthSeg, heightSeg, axis, position) {
        if (this.sphereHandler) {
            return this.sphereHandler.create(radius, widthSeg, heightSeg, axis, position);
        }
    }
    removeCube(name) {
        if (this.cubeHandler)
            return this.cubeHandler.remove(name);
    }
    popCubes(number) {
        if (this.cubeHandler)
            return this.cubeHandler.popMany(number);
    }
    findCube(name) {
        return this.cubeHandler.find(name);
    }
    translatorWithValue(mesh, axis, value) {
        return mesh.translateOnAxis(axis, value);
    }
}