"use strict";

function Clamp(value, from, to) {
    if (value > to) return to;
    if (value < from) return from;
    return value;
}

let Clamp01 = (value) => Clamp(value, 0, 1);

let Rad2Deg = (v) => v / 0.017453292519943295;
let Deg2Rad = (v) => v * 0.017453292519943295;

let RandInt = (from, to) => Math.round(Math.random() * (to - from)) + from;
