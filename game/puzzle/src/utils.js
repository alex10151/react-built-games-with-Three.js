


export function resetAxis(axis) {
    axis.x = 0;
    axis.y = 0;
    axis.z = 0;
}
export function increaseAxis(axis, value, isSetX = true, isSetY = false, isSetZ = false) {
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

