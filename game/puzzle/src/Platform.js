
import CubeHandler from './CubeHandler';

export default class Platform {
    constructor(cubeHandler) {
        this.cubeHandler = cubeHandler;
    }
    createCube(x = 1, y = 1, z = 1, axis,wired = true) {
        if (this.cubeHandler)
            return this.cubeHandler.createCube(x, y, z,axis,wired);
    }
    removeCube(name) {
        if (this.cubeHandler)
            return this.cubeHandler.removeCube(name);
    }
    popCubes(number) {
        if (this.cubeHandler)
            return this.cubeHandler.popCubes(number);
    }
}