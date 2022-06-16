"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("type of executor is not a function");
  }
  this._state = "pending";
  this._handlerGroups = [];

  //o bindear o hacer arrow fn
  executor(this._internalResolve.bind(this), (data) =>
    this._internalReject(data)
  );
}
$Promise.prototype._internalResolve = function (data) {
  if (this._state === "pending") {
    this._value = data;
    this._state = "fulfilled";
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (data) {
  if (this._state === "pending") {
    this._value = data;
    this._state = "rejected";
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== "function") successCb = false;
  if (typeof errorCb !== "function") errorCb = false;
  const downstreamPromise = new $Promise(function () {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  if (this._state !== "pending") this._callHandlers();

  return downstreamPromise;
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let actual = this._handlerGroups.shift();
    if (this._state === "fulfilled") {
      if (!actual.successCb) {
        // fulfillment bubble
        actual.downstreamPromise._internalResolve(this._value);
      } else {
        const result = actual.successCb(this._value);
        actual.downstreamPromise._internalResolve(result);
        actual.successCb(this._value);
      }
    } else {
      if (!actual.errorCb) {
        actual.downstreamPromise._internalReject(this._value);
      } else actual.errorCb(this._value);
    }
  }
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
