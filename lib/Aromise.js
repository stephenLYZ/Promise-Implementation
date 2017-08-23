'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PENDING = Symbol();
var FULFILLED = Symbol();
var REJECTED = Symbol();

var Aromise = function () {
  function Aromise(resolver) {
    _classCallCheck(this, Aromise);

    if (_typeof(this) !== 'object') {
      throw new Error('Promises must be constructed via new');
    }
    if (typeof resolver !== 'function') {
      throw new Error('resolver must be a function');
    }
    this.status = PENDING;
    this.value = null;
    this.handlers = [];
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.handle = this.handle.bind(this);
    resolver(this.resolve, this.reject);
  }

  _createClass(Aromise, [{
    key: 'reject',
    value: function reject(error) {
      this.status = REJECTED;
      this.value = error;
      this.handlers.forEach(this.handle);
      this.handlers = [];
    }
  }, {
    key: 'resolve',
    value: function resolve(result) {
      try {
        var then = typeof result.then == 'function' ? result.then : null;
        if (then) {
          this.then.call(result, this.resolve, this.reject);
          return;
        }
        this.status = FULFILLED;
        this.value = result;
        this.handlers.forEach(this.handle);
        this.handlers = [];
      } catch (error) {
        this.reject(error);
      }
    }
  }, {
    key: 'handle',
    value: function handle(_ref) {
      var onFulfill = _ref.onFulfill,
          onReject = _ref.onReject;

      switch (this.status) {
        case FULFILLED:
          onFulfill && onFulfill(this.value);
          break;
        case REJECTED:
          onReject && onReject(this.value);
          break;
        case PENDING:
          this.handlers.push({ onFulfill: onFulfill, onReject: onReject });
      }
    }
  }, {
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      var _this = this;

      return new Aromise(function (resolve, reject) {
        _this.handle({
          onFulfill: function onFulfill(value) {
            if (typeof onFulfilled === 'function') {
              try {
                resolve(onFulfilled(value));
              } catch (error) {
                reject(error);
              }
            } else {
              resolve(value);
            }
          },
          onReject: function onReject(error) {
            if (typeof onRejected === 'function') {
              reject(onRejected(error));
            } else {
              reject(error);
            }
          }
        });
      });
    }
  }]);

  return Aromise;
}();

module.exports = Aromise;
