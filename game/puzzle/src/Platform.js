import * as rxjs from 'rxjs';
export default class Platform {
    constructor(cubeHandler, planeHandler, pathHandler) {
        this.cubeHandler = cubeHandler;
        this.pathHandler = pathHandler;
        this.planeHandler = planeHandler;
    }
    createPath() {

    }
    generateObstacles(number) {
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
                console.log('1111111111', obstacle);
                rxjs.interval(100).subscribe(
                    n => {
                        if (obstacle) {
                            // if (obstacle.cube.position.z >= 0) {

                            // }
                            obstacle.cube.position.z += 0.5
                        }

                    }
                )
            }, Math.random() * 100000)

        );
        // this.obstacle = this.platform.createCube(1, 1, 1, { x: 0, y: 0, z: -10 }, { x: 0, y: 0, z: -10 }, false);
        // rxjs.interval(100).subscribe(
        //     n => {
        //         if (this.obstacle)
        //             this.obstacle.cube.position.z += (n / 10)
        //     }
        // );
    }
    translateMany(name, translateFunc) {
        if (name === 'cube') {
            return this.cubeHandler.objList.map(translateFunc);
        }
        if (name === 'path') {
            return this.pathHandler.objList.map(translateFunc);
        }

        if (name === 'plane') {
            return this.planeHandler.objList.map(translateFunc);
        }
    }
    addToSceneMany(name, scene) {
        if (name === 'cube') {
            return this.cubeHandler.objList.map((cube) =>
                scene.add(cube.cube)
            );
        }
        if (name === 'path') {
            return this.pathHandler.objList.map((obj) =>
                scene.add(obj)
            );
        }
        if (name === 'plane') {
            return this.planeHandler.objList.map((obj) =>
                scene.add(obj)
            );
        }
    }
    createPlane(width, height, x, y, z) {
        return this.planeHandler.create(width, height, x, y, z);
    }
    createCube(x = 1, y = 1, z = 1, axis, position, wired = true) {
        if (this.cubeHandler)
            return this.cubeHandler.create(x, y, z, axis, position, wired);
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