let ObjectId = require('mongodb').ObjectID;
const axios = require("axios");

module.exports.validateAndConvertId = validateAndConvertId;
module.exports.verifyArray = verifyArray;
module.exports.verifyFunc = verifyFunc;
module.exports.verifyIP = verifyIP;
module.exports.verifyIndex = verifyIndex;
module.exports.verifyNum = verifyNum;
module.exports.verifyObj = verifyObj;
module.exports.verifyString = verifyString;
exports.getJsonFromURL = getJsonFromURL;


let url = "";

async function getJsonFromURL(url) {
   const { data } = await axios.get(url);
    return data // this will be the array of people
  };

/*Function that takes one argument, id, and returns a valid Mongo DB id or throws an error.*/
async function validateAndConvertId(id) {

    if(!id) throw "You must provide an id to search for";
    
    if(typeof id !== ObjectId()) {
        if(!ObjectId.isValid(id)) throw "Invalid Object Id " + id + " because it is not a 12 character single string or 24 character hex value";
        
        id = ObjectId(id);
    }
    return id;
}

/*Function that takes two arguments, array and canBeEmpty. The function checks that array is 
actually a Javascript Array and throws an error if it is not. If canBeEmpty is true, an error will not 
be thrown if array is a null array.*/
async function verifyArray(array, canBeEmpty) {
    if(!array) {
        throw "ERROR: Array does not exist"
    }
    //if (array.isArray !== true) {
    if(typeof array !== 'object' && array.construtor !== Array) {
        throw "ERROR: Value passed in for 'array' is not an array"; 
    }
    if(typeof array === 'object' && array.constructor !== Array) {
        throw "ERROR: Value passed in for 'array' is not an array"; 
    }
    if (!canBeEmpty && array.length === 0) {
        throw "ERROR: Variable 'array' is empty";
    }
}

/*
Local Function that verifies the the index exists, is a number, and is a non negative
The Function can verify zeros with canBeZero indicator (when set to false, exception is thrown for 0 values)
The Function can verify non-integers (when set to false, exception is thrown for non-integers)
If an array is passed, the function verifies this index is within the bounds of the array
*/
async function verifyIndex(index, canBeZero, canBeNonInteger, array, argName = "Index") {
    if(!index && index !== 0) {
        throw "ERROR: " + argName + " cannot be false or empty"
    }
    if(typeof index !== "number") {
        throw "ERROR: " + argName + " is not a number"; 
    }
    if(index < 0) {
        throw "ERROR: " + argName + " out of bounds - less than 0";
    }
    if(!canBeZero && index === 0) {
        throw "ERROR: " + argName + " here cannot be set to 0"
    }
    if(!canBeNonInteger && (index === NaN || index === Number.POSITIVE_INFINITY || index === Number.NEGATIVE_INFINITY || index % 1 !== 0)){
        throw "ERROR: " + argName + " here must be an integer";
    }
    if(array && index > array.length - 1) {
        throw "ERROR: " + argName + " out of bounds - greater than array";
    }
}


async function verifyString (string, argName = "String") {
    if(!string && string !== "") {
        throw "ERROR: " + argName + " does not exist"
    }
    if(typeof string !== "string") {
        throw "ERROR: " + "Value passed in for parameter " + argName + " is not a string"; 
    }
}

async function verifyNum(num, canBeFloat, convertToNumberInd) {
   
    let originalNum = num;
    
    if(convertToNumberInd) {
        num = Number(num);
    }
    if(typeof num != "number"){
        throw "ERROR: " + originalNum + " element provided is not of type number";
    }
    if(!canBeFloat && RegExp('[.]').test(num.toString())) {
        throw "ERROR: " + originalNum + ' cannot be a float value'
    }
    if(!num && num !== 0) {
        throw "ERROR: " + originalNum +"  does not exist or is not number";
    }
    if(num < 0) {
        throw "ERROR: " +originalNum  + "  is less than 0";
    }
}
async function verifyIP(string) {
    if(!string) {
        throw "ERROR: " + "IP does not exist";
    }
    let regExpression = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(!string.match(regExpression)) {
        throw "ERROR: " + "Value passed for IP appears to be invalidly formatted.";
    }
}

async function verifyObj(obj) {
    if(typeof obj !== "object"  || obj == undefined) {
        throw "ERROR: " + "The argument passed is not a defined object";
    }
}

async function verifyFunc (func) {
    if(typeof func !== "function" || func == undefined) {
        throw "ERROR: " + "The function argument passed does not contain a defined function"
    }
}