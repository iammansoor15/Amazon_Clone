"use strict";
exports.__esModule = true;
exports.cli = void 0;
/**
 * Add two numbers
 */
function add(x, y) {
    console.log(x + y);
}
/**
 * Subtract two numbers
 */
function subtract(x, y) {
    console.log(x - y);
}
/**
 * Multiply two numbers
 */
function multiply(x, y) {
    console.log(x * y);
}
/**
 * Divider one number by the other
 */
function divide(x, y) {
    console.log(x / y);
}
/**
 * Square a number
 */
function square(x) {
    console.log(Math.pow(x, 2));
}
/**
 * Cube a number
 */
function cube(x) {
    console.log(Math.pow(x, 3));
}
/**
 * Cube a number
 */
function sqrt(x) {
    console.log(Math.sqrt(x));
}
/**
 * Bitwise and
 */
function bitwiseAnd(x, y) {
    console.log(x & y);
}
/**
 * Bitwise or
 */
function bitwiseOr(x, y) {
    console.log(x | y);
}
/**
 * Bitwise xor
 */
function bitwiseXor(x, y) {
    console.log(x ^ y);
}
exports.cli = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    square: square,
    cube: cube,
    sqrt: sqrt,
    bitwiseAnd: bitwiseAnd,
    bitwiseOr: bitwiseOr,
    bitwiseXor: bitwiseXor
};
