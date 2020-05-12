export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}