// window.functions.js
// Project Lead - Indong Yoo
// Maintainers - Joeun Ha, Jeongik Park
// (c) 2017 Marpple. MIT Licensed.
(function(w) {
  w._identity = w._idtt = function(v) { return v };
  w._noop = function() {};
  w._keys = function(obj) { return obj ? Object.keys(obj) : [] };
  w._mr = function() { return arguments._mr = true, arguments };

  w._pipe = function() {
    var fs = arguments, len = fs.length;
    return function(res) {
      var i = -1;
      while (++i < len) res = res && res._mr ? fs[i].apply(null, res) : fs[i](res);
      return res;
    }
  };

  w._go = function() {
    var i = 0, fs = arguments, len = fs.length, res = arguments[0];
    while (++i < len) res = res && res._mr ? fs[i].apply(null, res) : fs[i](res);
    return res;
  };

  w._each = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length;
    while (++i < len) iter(arr[i]);
    return arr;
  };

  w._oeach = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length;
    while (++i < len) iter(obj[keys[i]]);
    return obj;
  };

  w._map = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) res[i] = iter(arr[i]);
    return res;
  };

  w._omap = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) res[i] = iter(obj[keys[i]]);
    return res;
  };

  w._flatmap = w._mapcat = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [], evd;
    while (++i < len) Array.isArray(evd = iter(arr[i])) ? res.push.apply(res, evd) : res.push(evd);
    return res;
  };

  w._oflatmap = w._omapcat = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [], evd;
    while (++i < len) Array.isArray(evd = iter(obj[keys[i]])) ? res.push.apply(res, evd) : res.push(evd);
    return res;
  };

  w._filter = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) if (iter(arr[i])) res[i].push(arr[i]);
    return res;
  };

  w._ofilter = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) if (iter(obj[keys[i]])) res[i].push(obj[keys[i]]);
    return res;
  };

  w._reject = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) if (!iter(arr[i])) res[i].push(arr[i]);
    return res;
  };

  w._oreject = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) if (!iter(obj[keys[i]])) res[i].push(obj[keys[i]]);
    return res;
  };

  w._reduce = function f(arr, iter, init) {
    if (typeof arr == "function") return function(arr2){ return f(arr2, arr, iter) };
    var i = -1, len = arr && arr.length, res = init || arr[++i];
    while (++i < len) res = iter(res, arr[i]);
    return res;
  };

  w._oreduce = function f(obj, iter, init) {
    if (typeof obj == "function") return function(obj2){ return f(obj2, obj, iter) };
    var i = -1, keys = _keys(obj), len = keys.length, res = init || obj[keys[++i]];
    while (++i < len) res = iter(res, obj[keys[i]]);
    return res;
  };

  w._find = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length;
    while (++i < len) if (iter(arr[i])) return arr[i];
  };

  w._ofind = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length;
    while (++i < len) if (iter(obj[keys[i]])) return obj[keys[i]];
  };

  w._range = function(start, stop, step) {
    if (stop == null) { stop = start || 0; start = 0; }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
    return range;
  };

})(typeof global == 'object' ? global : window);