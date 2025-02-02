
function mapClamped(value, in_min, in_max, out_min, out_max) {
    let map_result = map(value, in_min, in_max, out_min, out_max);

    const clamp_result = Math.max(Math.min(map_result, Math.max(out_min, out_max)), Math.min(out_min, out_max));
    return clamp_result
}

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function clampf(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function randomInt(min, max) {
    return Math.floor(randomFloat(min, max));
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export { map, clampf,mapClamped,randomFloat,randomInt };
