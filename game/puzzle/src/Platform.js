
import CubeHandler from './CubeHandler';

export default class Platform {
    constructor(cubeHandler) {
        this.cubeHandler = cubeHandler;
    }
    createCube(x = 1, y = 1, z = 1) {
        if (this.cubeHandler)
            return this.cubeHandler.createCube(x, y, z);
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