// easingHelpers.js

// Linear easing
export function linear(t) {
    return t;
}

// Quadratic easing in
export function easeInQuad(t) {
    return t * t;
}

// Quadratic easing out
export function easeOutQuad(t) {
    return t * (2 - t);
}

// Quadratic easing in and out
export function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Cubic easing in
export function easeInCubic(t) {
    return t * t * t;
}

// Cubic easing out
export function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

// Cubic easing in and out
export function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Quartic easing in
export function easeInQuart(t) {
    return t * t * t * t;
}

// Quartic easing out
export function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Quartic easing in and out
export function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

// Quintic easing in
export function easeInQuint(t) {
    return t * t * t * t * t;
}

// Quintic easing out
export function easeOutQuint(t) {
    return 1 + (--t) * t * t * t * t;
}

// Quintic easing in and out
export function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
}

export function easeInOutPower2(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeOut(t) {
    return 1 - (--t) * t * t * t;
}

