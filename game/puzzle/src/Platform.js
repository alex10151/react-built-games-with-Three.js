
export default class Platform {
    constructor(cubeHandler, planeHandler, pathHandler) {
        this.cubeHandler = cubeHandler;
        this.pathHandler = pathHandler;
        this.planeHandler = planeHandler;
    }
    createPath() {

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