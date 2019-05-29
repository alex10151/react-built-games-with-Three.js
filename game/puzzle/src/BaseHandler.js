

export default class BaseHandler {
    constructor() {
        this.objList = [];
        this.objCounter = 0;
    }
    remove(name) {
        this.objList = this.objList.filter((x) => x.name !== name);
    }
    popMany(number) {
        return this.objList.splice(0, number);
    }
    find(name) {
        return this.objList.find((x) => x.name === name);
    }
}