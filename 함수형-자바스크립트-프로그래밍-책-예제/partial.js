// Partial.js 1.1.0
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Joeun Ha, Byeongjin Kim, Jeongik Park
// Respect Underscore.js
// (c) 2015-2017 Marpple. MIT Licensed.
!function(G) {
  var window = typeof window != 'object' ? G : window;

  var prev_ = window._;
  if (!window._previous_underscore && prev_ && !prev_._partialjs)
    window._previous_underscore = function() { return prev_ };
  window._partial_namespace = function() { return _ };

  _.partial = _; function _(fn) {
    if (_.isString(fn)) return _.method.apply(null, arguments);
    var args1 = [], args3, len = arguments.length, ___idx = len;
    for (var i = 1; i < len; i++) {
      var arg = arguments[i];
      if (arg == ___ && (___idx = i) && (args3 = [])) continue;
      if (i < ___idx) args1.push(arg);
      else args3.push(arg);
    }
    var f = function() { return fn.apply(this, merge_args(args1, arguments, args3)); };
    f._p_async = fn._p_async;
    return f;
  }
  _.partial._partialjs = true;
  function _to_unde(args1, args2, args3) {
    if (args2) args1 = args1.concat(args2);
    if (args3) args1 = args1.concat(args3);
    for (var i = 0, len = args1.length; i < len; i++) if (args1[i] == _) args1[i] = undefined;
    return args1;
  }
  function merge_args(args1, args2, args3) {
    if (!args2.length) return args3 ? _to_unde(args1, args3) : _to_unde(_.clone(args1));
    var n_args1 = _.clone(args1), args2 = _.to_array(args2), i = -1, l = n_args1.length;
    while (++i < l) if (n_args1[i] == _) n_args1[i] = args2.shift();
    if (!args3) return _to_unde(n_args1, args2.length ? args2 : undefined);
    var n_arg3 = _.clone(args3), i = n_arg3.length;
    if (args2.length) {
      while (i--) if (n_arg3[i] == _) n_arg3[i] = args2.pop();
      return _to_unde(n_args1, args2, n_arg3);
    }
    while (i-- && n_arg3[i] == _) n_arg3.pop();
    return _to_unde(n_args1, n_arg3);
  }
  _.m = _.method = function(method) {
    function f(obj) { return obj[method].apply(obj, _.rest(arguments)); }
    return _.apply(null, [f, _].concat(_.rest(arguments)));
  };
  _.bind = function(fn) {
    var f = Function.prototype.bind.apply(fn, _.rest(arguments));
    f._p_async = fn._p_async;
    return f;
  };

  _.is_array = _.isArray = Array.isArray;
  each(['Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is_' + name.toLowerCase()] = _['is' + name] = function(obj) { return Object.prototype.toString.call(obj) === '[object ' + name + ']'; }
  });
  _.is_fn = _.is_function = _.isFunction = function(fn) { return fn instanceof Function; };
  if (typeof /./ != 'function' && typeof Int8Array != 'object')
    _.is_fn = _.is_function = _.isFunction = function(obj) { return typeof obj == 'function' || false; };

  _.is_object = _.isObject = function(obj) {
    var type = typeof obj;
    return type == 'function' || type == 'object' && !!obj;
  };
  _.is_undefined = _.isUndefined = function(v) { return v === undefined; };
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _.is_array_like = _.isArrayLike = likearr; function likearr(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }
  var toString = Object.prototype.toString;
  _.is_finite = _.isFinite = function(obj) { return isFinite(obj) && !isNaN(parseFloat(obj)); };
  _.is_nan = _.isNaN = function(obj) { return _.isNumber(obj) && obj !== +obj; };
  _.is_boolean = _.isBoolean = function(obj) { return obj === true || obj === false || toString.call(obj) === '[object Boolean]'; };
  _.is_null = _.isNull = function(obj) { return obj === null; };
  _.is_numeric = _.isNumeric = function(n) { return !isNaN(parseFloat(n)) && isFinite(n); };
  _.is_arguments = _.isArguments = function(obj) { return !!(obj && obj.callee) };
  _.is_element = _.isElement = function(obj) { return !!(obj && obj.nodeType === 1) };
  _.wrapArray = _.wrap_arr = function(v) { return _.isArray(v) ? v : [v]; };
  _.parseInt = _.parse_int = function(v) { return parseInt(v, 10); };

  // Pipeline
  _.go = function(v, _fs) {
    if (this != _ && this != window) return _.is_fn(_fs) ? goapply(this, v, arguments, 1) : goapply(this, v, _fs);
    var i = 0, fs = arguments, f, need_catch = v instanceof Error;
    if (!_.is_fn(_fs)) i = -1, fs = _fs;
    while (f = fs[++i]) {
      try {
        if (v) {
          if (v.__mr) {
            if (thenable_mr(v)) return go_async(null, v, fs, i);
            if (need_catch ? !f.__catch_pipe : f.__catch_pipe) continue;
            if (v.__stop) return v.length == 1 ? v[0] : v.__stop = false || v;
            v = f.apply(undefined, v);
            continue;
          } else if (v.then && _.is_fn(v.then)) return go_async(null, v, fs, i) ;
        }
        if (need_catch ? !f.__catch_pipe : f.__catch_pipe) continue;
        v = v === undefined ? f() : f(v);
        need_catch = false;
      } catch (e) { v = e; need_catch = true; }
    }
    if (need_catch) _.loge(v);
    return v;
  };

  _.mr = mr, _.to_mr = to_mr, _.is_mr = is_mr, _.mr_cat = mr_cat;
  function mr() { return arguments.__mr = true, arguments; }
  function mr_cat() {
    for (var args = { length: 0, __mr: true }, i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      if (is_mr(arg)) for (var j = 0, len2 = arg.length; j < len2; j++) args[args.length++] = arg[j];
      else args[args.length++] = arg;
    }
    return args;
  }
  function to_mr(args) { return args.__mr = true, args; }
  function is_mr(v) { return v && v.__mr; }
  function safety_mr(args) { return args.length > 1 ? to_mr(args) : args[0]; }

  _.stop = function() {
    arguments.__stop = arguments.__mr = true;
    return arguments;
  };
  function goapply(self, v, fs, start) {
    var i = (start || 0), f, need_catch = v instanceof Error;
    while (f = fs[i++]) {
      try {
        if (v) {
          if (v.__mr) {
            if (thenable_mr(v)) return go_async(self, v, fs, i-1);
            if (need_catch ? !f.__catch_pipe : f.__catch_pipe) continue;
            if (v.__stop) return v.length == 1 ? v[0] : v.__stop = false || v;
            v = f.apply(self, v);
            continue;
          } else if (v.then && _.is_fn(v.then)) return go_async(self, v, fs, i-1) ;
        }
        if (need_catch ? !f.__catch_pipe : f.__catch_pipe) continue;
        v = v === undefined ? f.call(self) : f.call(self, v);
        need_catch = false;
      } catch (e) { v = e; need_catch = true; }
    }
    if (need_catch) _.loge(v);
    return v;
  }
  _.pipe = __; function __(_fs) {
    var fs = typeof _fs == 'function' ? arguments : _fs;
    return function() {
      arguments.__mr = true;
      return this == window || this == _ ? _.go(arguments, fs) : goapply(this, arguments, fs);
    }
  }
  _.indent = ___; function ___(_fs) {
    var fs = typeof _fs == 'function' ? arguments : _fs;
    return function() { return goapply(ithis(this, arguments), to_mr(arguments), fs); }
  }
  function ithis(self, args) { return { parent: self, arguments: args }; }

  _.tap = function() {
    var func = __(arguments);
    return function(arg) {
      var args = safety_mr(arguments);
      return _.go.call(this, args, func, _.c(args));
    }
  };
  _.add_arg = function() {
    var func = __(arguments);
    return function(arg) {
      var args = safety_mr(arguments);
      return _.go.call(this, args, func, function() {
        return mr_cat(arg, to_mr(arguments));
      });
    }
  };

  _.go.async = function(v) { return go_async(_.go == this ? null : this, v, arguments, 1); };
  __.async = function(_fs) {
    var fs = _.is_fn(_fs) ? arguments : _fs;
    function f() { return go_async(this, to_mr(arguments), fs, 0); }
    f._p_async = true;
    return f;
  };
  _.async = __.async; _.pipe.async = __.async; ___.async = _.indent.async = function(_fs) {
    var fs = _.is_fn(_fs) ? arguments : _fs;
    return function() { return go_async(ithis(this, arguments), to_mr(arguments), fs, 0); }
  };
  _.cb = _.callback = function(f) {
    return __.async(map(arguments, function(f) {
      return function() {
        var args = _.toArray(arguments), self = this;
        return new Promise(function(rs) { f.apply(self, args.concat(function() {
          rs(safety_mr(arguments));
        })); });
      };
    }));
  };
  _.boomerang = function() {
    var fs = arguments;
    return _.callback(function() {
      var args = arguments, cb = args[args.length-1];
      args.length--;
      var self = ithis(this, args);
      self.return = cb;
      go_async(self, to_mr(args), fs, 0);
    });
  };
  _.branch = function() {
    var fs = arguments;
    return function() {
      arguments.__mr = true;
      goapply(this, arguments, fs);
      return arguments;
    };
  };

  function thenable(res) {
    return res && typeof res.then == 'function';
  }
  function thenable_mr(mr) {
    var i = mr.length;
    while (i--) if (mr[i] && typeof mr[i].then == 'function') return true;
  }
  function unpack_promise(v) {
    return is_mr(v) ? thenable_mr(v) &&
      _.go(Promise.all(PA == Promise.all ? v : _.toArray(v)), to_mr) : thenable(v) && v;
  }

  function go_async(self, v, fs, i) {
    return new Promise(function(rs, rj) {
      var l = fs.length, need_catch;
      (function go(v) {
        do {
          if (i == l) return need_catch ? rj(v) : rs(fpro(v));

          var pm = unpack_promise(v);
          if (pm) return pm.then(go, function(v) { need_catch = true; go(v); });

          if (v && v.__stop) {
            i = l;
            v = v.length == 1 ? v[0] : v.__stop = false || v;
            continue;
          }

          if ((need_catch ? !fs[i].__catch_pipe : fs[i].__catch_pipe) && i++) continue;
          need_catch = false;
          try { v = is_mr(v) ? fs[i++].apply(self, v) : v === undefined ? fs[i++].call(self) : fs[i++].call(self, v); }
          catch (e) { v = e; need_catch = true; }
        } while (i <= l);
      })(v);
    });
  }
  function fpro(res) { return is_mr(res) && res.length == 1 ? res[0] : res; }

  _.catch = function() {
    var f = __(arguments);
    return f.__catch_pipe = true, f;
  };

  _.all2 = function(args) {
    var res = [], tmp;
    for (var i = 1, l = arguments.length; i < l; i++) {
      tmp = _.is_mr(args) ?
        arguments[i].apply(this == _ ? null : this, args) : arguments[i].call(this == _ ? null : this, args);
      if (_.is_mr(tmp)) for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else res.push(tmp);
    }
    return to_mr(res);
  };
  _.spread2 = function(args) {
    var fns = _.rest(arguments, 1), res = [], tmp;
    for (var i = 0, fl = fns.length, al = args.length; i < fl || i < al; i++) {
      tmp = _.is_mr(args[i]) ?
        (fns[i] || _.idtt).apply(this == _ ? null : this, args[i]) : (fns[i] || _.idtt).call(this == _ ? null : this, args[i]);
      if (_.is_mr(tmp)) for (var j = 0, l = tmp.length; j < l; j++) res.push(tmp[j]);
      else res.push(tmp);
    }
    return to_mr(res);
  };
  _.all = _.All = function() {
    var fns = _.last(arguments);
    if (_.isArray(fns)) return _.all2.apply(this, [to_mr(_.initial(arguments))].concat(fns));
    fns = _.toArray(arguments);
    return function() { return _.all2.apply(this, [to_mr(arguments)].concat(fns)); };
  };
  _.spread = _.Spread = function() {
    var fns = _.last(arguments);
    if (_.isArray(fns)) return _.spread2.apply(this, [to_mr(_.initial(arguments))].concat(fns));
    fns = _.toArray(arguments);
    return function() { return _.spread2.apply(this, [to_mr(arguments)].concat(fns)); };
  };

  _.if = _.If = function(predi, fn) {
    var store = [fn ? [predi, fn] : [_.identity, predi]];
    return _.extend(If, {
      else_if: elseIf,
      elseIf: elseIf,
      else: function(fn) { return store.push([_.constant(true), fn]) && If; }
    });
    function elseIf(predi, fn) { return store.push(fn ? [predi, fn] : [_.identity, predi]) && If; }
    function If() {
      var context = this, args = arguments;
      return _.go.call(this, store,
        _(_.find, _, function(fnset) { return fnset[0].apply(context, args); }),
        function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; });
    }
  };
  _.or = function() {
    var fns = arguments;
    return function() {
      return function f(res, i) {
        if (i == fns.length) return;
        return _.go(res, fns[i], function(res) {
          return res || _.go(mr(res, i+1), f);
        });
      }(to_mr(arguments), 0);
    }
  };

  _.noop = function() {};
  _.this = function() { return this; };
  _.idtt = _.identity = function(v) { return v; };
  _.aidtt = _.async(_.idtt);
  _.i = _.i18n = function(key/*, value*/) { // TODO
    return arguments.length == 1 ? key : _.toArray(arguments).join(" ");
  };
  _.args = function() { return arguments; };
  _.args0 = _.identity;
  _.args1 = function() { return arguments[1]; };
  _.args2 = function() { return arguments[2]; };
  _.args3 = function() { return arguments[3]; };
  _.args4 = function() { return arguments[4]; };
  _.a = _.c = _.always = _.constant = function(v) { return function() { return v; }; };
  _.true = _.constant(true);
  _.false = _.constant(false);
  _.null = _.constant(null);
  _.not = function(v) { return !v; };
  _.nnot = function(v) { return !!v; };
  _.log = window.console && window.console.log ? console.log.bind ? console.log.bind(console) :
    function() { console.log.apply(console, arguments); } : _.idtt;
  _.loge = window.console && window.console.error ? console.error.bind ? console.error.bind(console) : function() { console.error.apply(console, arguments); } : _.idtt;
  _.Err = function(message) { return new Error(message); };
  _.hi = _.tap(_.log);
  _.Hi = function(pre) { return _(_.log, pre); };

  _.f = function(nodes) {
    var f = _.val(window, nodes);
    var err = Error('warning: ' + nodes + ' is not defined');
    return f || setTimeout(function() { (f = f || _.val(window, nodes)) || _.loge(err) }, 500)
      && function() { return (f || (f = _.val(window, nodes))).apply(this, arguments); }
  };
  _.v = _.val = function(obj, key, keys) {
    if (arguments.length == 1) return _.property(obj);
    return key == null ? void 0 : (function v(obj, i, keys, li) {
      return (obj = obj[keys[i]]) ? li == i ? obj : v(obj, i + 1, keys, li) : li == i ? obj : void 0;
    })(obj || {}, 0, keys = (key+'').split('.'), keys.length - 1);
  };
  _.property = function(key) { return _(_.val, _, key); };
  _.propertyOf = function(obj) {
    return obj == null ? function() {} : function(key) { return obj[key]; };
  };

  var hasOwnProperty = Object.hasOwnProperty;
  _.has = function(obj, key) { return obj != null && hasOwnProperty.call(obj, key); };

  var slice = Array.prototype.slice;
  _.rest = function f(array, n, guard) {
    return _.isNumber(array) ? _(f, _, array) : slice.call(array, n == null || guard ? 1 : n);
  };
  _.values = function(obj) {
    var ks = _keys(obj), l = ks.length, res = Array(l), i = -1;
    while (++i < l) res[i] = obj[ks[i]];
    return res;
  };
  _.toArray = _.to_array = function(obj) {
    return _.isArray(obj) ? obj : likearr(obj) ? slice.call(obj) : _.values(obj);
  };
  _.keyval = _.obj = _.object = function f(list, vals) {
    var obj = {};
    if (_.isString(list)) obj[list] = vals;
    else for (var i = 0, l = getLength(list); i < l; i++)
      vals ? obj[list[i]] = vals[i] : obj[list[i][0]] = list[i][1];
    return obj;
  };
  _.valkey = function(o, k) { return _.obj(k, o); };
  _.obj2 = _.object2 = function f(obj, ks1, ks2) {
    return arguments.length == 2 ? _(f, _, obj, ks1) : _.obj(_.wrap_arr(ks1), _.values(_.pick(obj, ks2)));
  };
  _.keys = _keys; function _keys(obj) {
    return _.isObject(obj) ? Object.keys(obj) : [];
  }
  _.size = function(obj) {
    return likearr(obj) ? obj.length : _keys(obj).length;
  };
  _.nest = function f(key, val) {
    return arguments.length == 1 ? _(f, key) : _.reduceRight(key.split('.'), _.valkey, val);
  };
  _.invert = _invert; function _invert(obj) {
    var keys = _keys(obj), l = keys.length, res = {};
    for (var i = 0; i < l; i++) res[obj[keys[i]]] = keys[i]
    return res;
  }

  var escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' };
  var unescapeMap = _invert(escapeMap);
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    var source = '(?:' + _keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  var idCounter = 0;
  _.unique_id = _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    if (_.isArray(obj)) return obj.slice();
    var cloned = _.extend({}, obj);
    delete cloned._memoize;
    return cloned;
  };
  _.is_empty = _.isEmpty = function(v) {
    return (likearr(v) && (_.isArray(v) || _.isString(v) || _.isArguments(v)) ? v : _keys(v)).length === 0;
  };

  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };
  _.memoize2 = function(mid) {
    return function(fn) {
      var memoize_id = ++mid, f = arguments.length == 1 ? fn : __(arguments);
      return function(obj) {
        return _.has(obj._memoize || (obj._memoize = function(){}), memoize_id) ?
          obj._memoize[memoize_id] : (obj._memoize[memoize_id] = f(obj));
      }
    }
  }(0);

  _.wait = function(t) {
    return _.callback(function() {
      var args = arguments, cb = args[args.length-1];
      args.length--;
      setTimeout(function() { cb.apply(null, args); }, t || 0);
    });
  };
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };
  _.defer = _.partial(_.delay, _, 1);

  _.throttle = function(func, wait, options) {
    var context, args, result, timeout = null, previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now2 = Date.now();
      if (!previous && options.leading === false) previous = now2;
      var remaining = wait - (now2 - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now2;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function() {
      var last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };
    return function() {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  };

  _.negate = function(predi) {
    return function() { return !predi.apply(this, arguments); };
  };
  _.after = function(times, func) {
    return function() { if (--times < 1) return func.apply(this, arguments); };
  };
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) memo = func.apply(this, arguments);
      if (times <= 1) func = null;
      return memo;
    };
  };
  _.once = _.partial(_.before, 2);

  var eq = function(a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null) return a === b;
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        return '' + a === '' + b;
      case '[object Number]':
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.is_fn(aCtor) && aCtor instanceof aCtor &&
        _.is_fn(bCtor) && bCtor instanceof bCtor)
        && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      if (aStack[length] === a) return bStack[length] === b;
    }

    aStack.push(a);
    bStack.push(b);

    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      var keys = _keys(a), key;
      length = keys.length;
      if (_keys(b).length !== length) return false;
      while (length--) {
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }

    aStack.pop();
    bStack.pop();
    return true;
  };
  _.is_equal = _.isEqual = function f(a, b) { return arguments.length == 1 ? _(f, a) : eq(a, b); };

  _.is_match = _.isMatch = _.matcher = function f(object, attrs) {
    if (arguments.length == 1) return _(f, _, object);
    var keys = _keys(attrs), length = keys.length;
    if (object == null) return !length;
    for (var i = 0, obj = Object(object), key; i < length; i++)
      if (attrs[key = keys[i]] != obj[key] || !(key in obj)) return false;
    return true;
  };

  function each(list, iter, start) {
    for (var i = start || 0, l = getLength(list); i < l ;i++) iter(list[i], i, list);
    return list;
  }
  function map(d, iter) {
    var i = -1, l = d && d.length, ks = typeof l == 'number' ? null : _keys(d), res = [], l = (ks || d).length;
    while (++i < l) res[i] = iter(d[ks ? ks[i] : i]);
    return res;
  }
  function filter(d, iter) {
    var i = -1, l = d && d.length, ks = typeof l == 'number' ? null : _keys(d), res = [], l = (ks || d).length, v;
    while (++i < l) if (iter(v = d[ks ? ks[i] : i])) res[res.length] = v;
    return res;
  }
  function times2(len, fn) { for (var i = 1; i <= len; i++) fn(i); }
  _.times = function(len, iter) { for (var i = 0; i < len; i++) iter(i); };

  try { var has_lambda = true; eval('a=>a'); } catch (err) { var has_lambda = false; }
  _.l = _.lambda = lambda; function lambda(str) {
    if (typeof str !== 'string') return str;
    str = str.replace(/\*\*/g, '"');
    if (!has_lambda) str = str.replace(/`/g, "'");
    if (lambda[str]) return lambda[str];

    if (str.indexOf('#') == 0)
      return lambda[str] = function(id) { return function($) { return $.id == id; } }(parseInt(str.substr(1)));
    if (!str.match(/=>/))
      return lambda[str] = new Function('$', 'return (' + str + ')');
    if (has_lambda) return lambda[str] = eval(str); // es6 lambda
    var ex_par = str.split(/\s*=>\s*/);
    return lambda[str] = new Function(
      ex_par[0].replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [],
      'return (' + ex_par[1] + ')');
  }

  function bexdf(setter, args) {
    for (var i = 1, len = args.length, obj1 = args[0]; i < len; i++)
      if (obj1 && args[i]) setter(obj1, args[i]);
    if (obj1) delete obj1._memoize;
    return obj1;
  }
  function setter(r, s) { for (var key in s) r[key] = s[key]; }
  function dsetter(r, s) { for (var key in s) if (!_.has(r, key)) r[key] = s[key]; }

  _.extend = function() { return bexdf(setter, arguments); };
  _.defaults = function() { return bexdf(dsetter, arguments); };

  function flat(new_arr, arr, noDeep, start) {
    each(arr, function(v) {
      if (!likearr(v) || (!_.isArray(v) && !_.isArguments(v))) return new_arr.push(v);
      noDeep ? each(v, function(v) { new_arr.push(v); }) : flat(new_arr, v, noDeep);
    }, start);
    return new_arr;
  }
  _.flatten = function(arr, noDeep, start) { return flat([], arr, noDeep, start); };

  function Iter(args, is_reduce) {
    var start = is_reduce ? 3 : 2;
    var iter = args[args.length - (is_reduce ? 2 : 1)];
    var args2 = [];
    for (var i = 0, l = args.length-start; i < l; i++) args2[i] = args[i];
    args2[i+start] = args[args.length-2];
    var f = function() {
      args2[i] = arguments[0];
      args2[i+1] = arguments[1];
      if (is_reduce) args2[i+2] = arguments[2];
      return iter.apply(this, args2);
    };
    f._p_async = iter._p_async;
    return f;
  }

  function collf(fn, asy_fn) {
    return function f(d, i) {
      if (arguments.length == 1 && (_.is_fn(d) || typeof d == 'string')) return _(f, ___, d);

      if (arguments.length > 2) var data = arguments[arguments.length-2], iter = Iter(arguments);
      else var data = d, iter = typeof i == 'string' ? _.val(i) : (i || _.idtt);
      if (this != _ && this != G) iter = _.bind(iter, this);

      var ks = likearr(data) ? null : _keys(data), l = (ks || data).length, i = -1, mp, k;
      if (iter._p_async) return asy_fn(data, iter, ks, mp, i, l, k);

      if (asy_fn && l) mp = iter(data[k = ks ? ks[++i] : ++i], k, data);

      return (mp && (mp.__mr ? thenable_mr(mp) : mp.then && _.is_fn(mp.then)) ? asy_fn : fn)(data, iter, ks, mp, i, l, k);
    }
  }

  _.each = collf(function(data, iter, ks, evd, i, l, k) {
    while (++i < l) iter(data[k = ks ? ks[i] : i], k, data);
    return data;
  }, function f(data, iter, ks, mp, i, l, k) {
    return _.go.async(mp, function() {
      return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l) : data;
    });
  });

  _.map = collf(function(data, iter, ks, evd, i, l, k) {
    if (!l) return [];
    var res = [evd];
    while (++i < l) res[i] = iter(data[k = ks ? ks[i] : i], k, data);
    return res;
  }, function f(data, iter, ks, mp, i, l, k, res) {
    return l ? _.go.async(mp, function(evd) {
      res ? res[i] = evd : (res = [evd]);
      return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l, k, res || []) : res;
    }) : _.aidtt([]);
  });

  _.if_arr_map = function f(v, iter) {
    if (arguments.length == 1) return _(f, _, v);
    return _.is_array(v) ? _.map(v, iter) : iter(v);
  };

  _.cmap = collf(null, function(data, iter, ks, evd, i, l, k) {
    if (!l) return _.aidtt([]);
    var res = [];
    while (++i < l) res[i] = iter(data[k = ks ? ks[i] : i], k, data);
    return _.map(res, _.aidtt);
  });

  _.sum = function f(data) {
    if (_.is_fn(data)) return _(f, ___, data);
    if (!_.is_fn(arguments[arguments.length-1])) arguments[arguments.length++] = _.idtt;
    return _.go(to_mr(arguments),
      _.map,
      function(list) {
        if (!list.length) return list;
        var i = 0, result = list[0], len = list.length;
        while (++i < len) result += list[i];
        return result;
      });
  };

  _.join = function f(arr, sep) {
    return (arr == undefined || typeof arr == "string") ? _(f, _, arr) : _.toArray(arr).join(sep);
  };

  var _reduce_async = function f(data, iter, keys, mp, i) {
    return _.go(mp, function(memo) {
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? memo : f(data, iter, keys, iter(memo, data[key], key, data), ++i);
    });
  };
  function reduce(body, _async) {
    return function f(d, i, m) {
      if (arguments.length == 1) return _(f, _, ___, d, _);
      if (arguments.length == 2 && _.is_fn(d)) return _(f, ___, d, _.is_fn(i) ? i : _(_.clone, i));
      if (arguments.length < 4) var data = d, iter = i, memo = m;
      else var data = arguments[arguments.length-3], iter = Iter(arguments, true), memo = arguments[arguments.length-1];
      memo = _.is_fn(memo) ? memo.call(this, d) : memo;

      if (this != _ && this != G) iter = _.bind(iter, this);
      var keys = likearr(data) ? null : _keys(data);

      return (iter._p_async ? _async : body)(data, iter, keys, memo, arguments.length > 2, 0);
    }
  }
  _.reduce = reduce(function(data, iter, keys, memo, has_memo, i) {
    if (keys) {
      memo = has_memo ? memo : data[keys[i++]];
      var l = keys.length;
      if (!l || l==i) return memo;
      memo = iter(memo, data[keys[i]], keys[i++], data);
      if (memo && (memo.__mr ? thenable_mr(memo) : memo.then && _.is_fn(memo.then)))
        return _reduce_async(data, iter, keys, memo, i);
      while (i < l) memo = iter(memo, data[keys[i]], keys[i++], data);
    } else {
      memo = has_memo ? memo : data[i++];
      var l = data.length;
      if (!l || l==i) return memo;
      memo = iter(memo, data[i], i++, data);
      if (memo && (memo.__mr ? thenable_mr(memo) : memo.then && _.is_fn(memo.then)))
        return _reduce_async(data, iter, null, memo, i);
      while (i < l) memo = iter(memo, data[i], i++, data);
    }
    return memo;
  }, function(data, iter, keys, memo, has_memo, i) {
    return _reduce_async(data, iter, keys, has_memo ? memo : keys ? data[keys[i++]] : data[i++], i);
  });

  var _reduce_right_async = function f(data, iter, keys, mp, i) {
    return _.go(mp, function(memo) {
      var key = keys ? keys[i] : i;
      return (keys || data).length == i ? memo : f(data, iter, keys, iter(memo, data[key], key, data), ++i);
    });
  };
  _.reduceRight = _.reduce_right = reduce(function(data, iter, keys, memo, has_memo) {
    if (keys) {
      var i = keys.length - 1;
      memo = has_memo ? memo : data[keys[i--]];
      if (!keys.length || i==-1) return memo;
      memo = iter(memo, data[keys[i]], keys[i--], data);
      if (memo && (memo.__mr ? thenable_mr(memo) : memo.then && _.is_fn(memo.then)))
        return _reduce_async(data, iter, keys, memo, i);
      while (i > -1) memo = iter(memo, data[keys[i]], keys[i--], data);
    } else {
      var i = data.length - 1;
      memo = has_memo ? memo : data[i--];
      if (!data.length || i==-1) return memo;
      memo = iter(memo, data[i], i--, data);
      if (memo && (memo.__mr ? thenable_mr(memo) : memo.then && _.is_fn(memo.then)))
        return _reduce_async(data, iter, null, memo, i);
      while (i > -1) memo = iter(memo, data[i], i--, data);
    }
    return memo;
  }, function(d, iter, ks, memo, has_memo) {
    var i = (ks || d).length - 1;
    return _reduce_right_async(d, iter, ks, has_memo ? memo : ks ? d[ks[i--]] : d[i--], i);
  });

  _.break = function() { return arguments.__break = true, arguments; };
  _.loop = function f(d, i, m) {
    if (arguments.length == 1) return _(f, _, ___, d, _);
    if (arguments.length == 2 && _.is_fn(d))
      return _(f, ___, d, _.is_fn(i) ? i : _(_.clone, i));

    if (arguments.length < 4) var data = d, iter = i, memo = m;
    else var data = arguments[arguments.length-3], iter = Iter(arguments, true), memo = arguments[arguments.length-1];
    memo = _.is_fn(memo) ? memo.call(this) : memo;

    if (this != _ && this != G) iter = _.bind(iter, this);
    var keys = likearr(data) ? null : _keys(data);
    memo = arguments.length > 2 ? memo : data[keys ? keys[0] : 0];

    return _.go(_.find(data, function(d, i, data) {
      return _.go(iter(memo, d, i, data),
        function(result) {
          var stop = result && result.__break;
          memo = stop ? result[0] : result;
          return stop;
        });
    }), function() { return memo });
  };

  _.find = collf(function(data, iter, ks, evd, i, l, k) {
    if (evd) return data[k];
    while (++i < l) if (iter(data[k = ks ? ks[i] : i], k, data)) return data[k];
  }, function f(data, iter, ks, mp, i, l, k) {
    return l ? _.go(mp, function(evd) {
      if (evd) return data[k];
      return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l, k) : undefined;
    }) : _.aidtt();
  });

  _.filter = collf(function(data, iter, ks, evd, i, l, k) {
    if (!l) return [];
    var res = evd ? [data[k]] : [];
    while (++i < l) if (iter(data[k = ks ? ks[i] : i], k, data)) res.push(data[k]);
    return res;
  }, function f(data, iter, ks, mp, i, l, k, res) {
    return l ? _.go(mp, function(evd) {
      res = res || [];
      if (evd) res.push(data[k]);
      return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l, k, res) : res;
    }) : _.aidtt([]);
  });

  _.reject = collf(function(data, iter, ks, evd, i, l, k) {
    if (!l) return [];
    var res = !evd ? [data[k]] : [];
    while (++i < l) if (!iter(data[k = ks ? ks[i] : i], k, data)) res.push(data[k]);
    return res;
  }, function f(data, iter, ks, mp, i, l, k, res) {
    return l ? _.go(mp, function(evd) {
      res = res || [];
      if (!evd) res.push(data[k]);
      return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l, k, res) : res;
    }) : _.aidtt([]);
  });

  function every_or_some(is_some) {
    return collf(function(data, iter, ks, evd, i, l, k) {
      if (!l) return false;
      if (is_some ? evd : !evd) return is_some;
      while (++i < l) {
        evd = iter(data[k = ks ? ks[i] : i], k, data);
        if (is_some ? evd : !evd) return is_some;
      }
      return !is_some;
    }, function f(data, iter, ks, mp, i, l, k) {
      return l ? _.go.async(mp, function(evd) {
        if (i > -1 && (is_some ? evd : !evd)) return is_some;
        return ++i < l ? f(data, iter, ks, iter(data[k = ks ? ks[i] : i], k, data), i, l, k) : !is_some;
      }) : _.aidtt(false);
    });
  }
  _.every = every_or_some(false);
  _.some = every_or_some(true);
  _.where = function(list, attrs) {
    return arguments.length == 1 ? _.filter(function(obj) { return _.is_match(obj, list) }) :
      _.filter(list, function(obj) { return _.is_match(obj, attrs) });
  };
  _.findWhere = _.find_where = function(list, attrs) {
    return arguments.length == 1 ? _.find(function(obj) { return _.is_match(obj, list) }) :
      _.find(list, function(obj) { return _.is_match(obj, attrs) });
  };
  _.contains = function(obj, item, fromIndex) {
    if (!likearr(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number') fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };
  _.invoke = function(data, method) {
    var args = _.rest(arguments, 2), isFunc = _.is_fn(method);
    return _.map(data, function(val) {
      var func = isFunc ? method : val[method];
      return func && func.apply(val, args);
    });
  };
  _.pluck = function f(data, key) {
    return arguments.length == 1 ? _(f, _, data) : _.map(data, _.val(key));
  };
  _.deep_pluck = _.deepPluck = function f(data, keys) {
    if (arguments.length == 1) return _(f, _, data);
    var keys = _.isString(keys) ? keys.split(/\s*\.\s*/) : [''], len = keys.length, new_keys;
    return _.reduce(likearr(data) ? data : [data], function(mem, val) {
      var current = val, i = -1;
      while (++i < len && _.isObject(current) && !_.isArray(current)) current = current[keys[i]];
      return mem.concat(i >= len ? (_.isArray(current) ? [current] : current) :
        (_.isArray(current) ? f(current, new_keys || (new_keys = _.rest(keys, i).join('.'))) : void 0));
    }, []);
  };

  // async not supported
  _.max = collf(function(data, iter, ks, X, i, l, k) {
    if (!l) return;
    var res = data[k = ks ? ks[++i] : ++i], evd = iter(data[k], k, data), evd2;
    while (++i < l) if (evd < (evd2 = iter(data[k = ks ? ks[i] : i], k, data))) { res = data[k]; evd = evd2 }
    return res;
  });

  // async not supported
  _.min = collf(function(data, iter, ks, X, i, l, k) {
    if (!l) return;
    var res = data[k = ks ? ks[++i] : ++i], evd = iter(data[k], k, data), evd2;
    while (++i < l) if (evd > (evd2 = iter(data[k = ks ? ks[i] : i], k, data))) { res = data[k]; evd = evd2 }
    return res;
  });

  // async not supported
  _.sortBy = _.sort_by = collf(function(data, iter) {
    return _.pluck(_.map(data, function(val, idx, list) {
      return { val: val, idx: idx, criteria: iter(val, idx, list) };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.idx - right.idx;
    }), 'val');
  });

  // async not supported
  _.groupBy = _.group_by = collf(function(data, iter, ks, evd, i, l, k) {
    var res = {}, val;
    while (++i < l) _.has(res, evd = iter(val = data[k = ks ? ks[i] : i], k, data)) ? res[evd].push(val) : (res[evd] = [val]);
    return res;
  });
  // async not supported
  _.indexBy = _.index_by = collf(function(data, iter, ks, evd, i, l, k) {
    var res = {}, val;
    while (++i < l) res[iter(val = data[k = ks ? ks[i] : i], k, data)] = val;
    return res;
  });
  // async not supported
  _.countBy = _.count_by = collf(function(data, iter, ks, evd, i, l, k) {
    var res = {};
    while (++i < l) _.has(res, evd = iter(data[k = ks ? ks[i] : i], k, data)) ? res[evd]++ : (res[evd] = 1);
    return res;
  });
  _.shuffle = function(obj) {
    var set = likearr(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };
  _.random = function(min, max) {
    if (max == null) max = min, min = 0;
    return min + Math.floor(Math.random() * (max - min + 1));
  };
  _.sample = function(data, num) {
    if (arguments.length == 2 && num < 1) return [];
    return num ? _.shuffle(data).slice(0, num) : _.shuffle(data)[0];
  };
  _.partition = collf(function(data, iter, ks, evd, i, l, k) {
    var filter = [], reject = [];
    while (++i < l) (iter(data[k = ks ? ks[i] : i], k, data) ? filter : reject).push(data[k]);
    return [filter, reject];
  });

  _.first = _.head = _.take = function f(ary, n, guard) {
    if (arguments.length == 1 && _.isNumber(ary)) return _(f, _, ary);
    if (ary == null) return void 0;
    if (n == null || guard) return ary[0];
    return _.initial(ary, ary.length - n);
  };
  _.initial = function f(ary, n, guard) {
    if (arguments.length == 1 && _.isNumber(ary)) return _(f, _, ary);
    return slice.call(ary, 0, Math.max(0, ary.length - (n == null || guard ? 1 : n)));
  };
  _.last = function f(ary, n, guard) {
    if (arguments.length == 1 && _.isNumber(ary)) return _(f, _, ary);
    if (ary == null) return void 0;
    if (n == null || guard) return ary[ary.length - 1];
    return _.rest(ary, Math.max(0, ary.length - n));
  };

  _.compact = _.filter(_.identity);
  _.without = function(ary) { return _.difference(ary, slice.call(arguments, 1)) };
  _.union = function() { return _.uniq(_.flatten(arguments, true)); };

  _.intersection = function(ary) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(ary); i < length; i++) {
      var item = ary[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };
  _.difference = function(list) {
    var rest = _.flatten(arguments, true, 1);
    return _.reject(list, function(val) { return _.contains(rest, val); });
  };

  _.zip = function() { return _.unzip(arguments); };
  _.unzip = function(ary) {
    var length = ary && getLength(_.max(ary, getLength)) || 0, result = Array(length);
    for (var index = 0; index < length; index++) result[index] = _.pluck(ary, index);
    return result;
  };

  // async not supported
  _.unique = _.uniq = collf(function(data, iter, ks, evd, i, l, k) {
    var res = [], tmp = [];
    while (++i < l)
      if (tmp.indexOf(evd = iter(data[k = ks ? ks[i] : i], k, data)) == -1) { tmp.push(evd); res.push(data[k]); }
    return res;
  });
  _.append = function(arr, item) {
    for (var i = 1, l = arguments.length; i < l; i++) arr[arr.length++] = arguments[i];
    return arr;
  };

  function getLength(list) { return list == null ? void 0 : list.length; }

  // async not supported
  _.sortedIndex = _.sorted_i = function f(d, o, i) {
    if (_.is_fn(d)) return _(f, _, _, d);
    if (arguments.length > 3) {
      var data = arguments[arguments.length-3];
      var obj = arguments[arguments.length-2];
      var iter = _.apply(null, _.last(arguments, 1).concat(_.initial(arguments, 3)));
    } else {
      var data = d, obj = o, iter = i || _.idtt;
    }

    if (this != _ && this != G) iter = _.bind(iter, this);
    var value = iter(obj);
    var low = 0, high = getLength(data);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iter(data[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // async not supported
  _.find_i = _.findIndex = collf(function(data, iter, X, X, i, l) {
    while (++i < l) if (iter(data[i], i, data)) return i;
    return -1;
  });

  // async not supported
  _.findLastIndex = _.find_last_i = collf(function(data, iter, X, X, X, l) {
    while (l--) if (iter(data[l], l, data)) return l;
    return -1;
  });

  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }
  _.index_of = _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.last_index_of = _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  _.range = function(start, stop, step) {
    if (stop == null) { stop = start || 0; start = 0; }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
    return range;
  };

  // async not supported
  _.mapObject = _.map_object = collf(function(data, iter, ks, X, i, l, k) {
    var res = {};
    while (++i < l) res[k = ks ? ks[i] : i] = iter(data[k], k, data);
    return res;
  });

  _.pairs = function(obj) {
    var keys = _keys(obj), l = keys.length, res = Array(l), i = -1;
    while (++i < l) res[i] = [keys[i], obj[keys[i]]];
    return res;
  };
  _.functions = function(obj) {
    var names = [];
    for (var key in obj) if (_.is_fn(obj[key])) names.push(key);
    return names.sort();
  };

  // async not supported
  _.find_k = _.find_key = _.findKey = collf(function(data, iter, ks, X, i, l, k) {
    while (++i < l) if (iter(data[k = ks ? ks[i] : i], k, data)) return k;
  });

  // async not supported
  _.pick = function f(d, i) { // (data, key1, key2, key3)은 지원 안됨
    if (arguments.length == 1) return _(f, ___, d);
    if (arguments.length == 2) var data = d, iter = i;
    else var data = arguments[arguments.length-2], iter = Iter(arguments);
    if (!data) return {};
    if (this != _ && this != G && _.is_fn(iter)) iter = _.bind(iter, this);
    var res = {}, i = -1;
    if (_.is_fn(iter)) {
      var keys = _keys(data), l = keys.length;
      while (++i < l) {
        var key = keys[i], val = data[key];
        if (iter(val, key, data)) res[key] = val;
      }
    } else {
      var keys = _.wrap_arr(iter), l = keys.length;
      while (++i < l) {
        var key = keys[i];
        if (key in data) res[key] = data[key];
      }
    }
    return res;
  };

  // async not supported
  _.omit = function f(d, i) { // (data, key1, key2, key3)은 지원 안됨
    if (arguments.length == 1) return _(f, ___, d);
    if (arguments.length == 2) var data = d, iter = i;
    else var data = arguments[arguments.length-2], iter = Iter(arguments);
    if (!data) return {};
    if (this != _ && this != G && _.is_fn(iter)) iter = _.bind(iter, this);
    var res = {}, i = -1;
    if (_.is_fn(iter)) {
      var keys = _keys(data), l = keys.length;
      while (++i < l) if (!iter(data[keys[i]], keys[i], data)) res[keys[i]] = data[keys[i]];
    } else {
      var oKeys = _keys(data), keys = _.wrap_arr(iter), l = oKeys.length;
      while (++i < l) if (keys.indexOf(oKeys[i]) == -1) res[oKeys[i]] = data[oKeys[i]];
    }
    return res;
  };

  // template
  var s_matcher_reg1 = /\{\{\{.*?\}\}\}/g, s_matcher_reg2 = /\{\{.*?\}\}/g;
  var insert_datas1 = _.partial(s_exec, s_matcher_reg1, _.escape); // {{{}}}
  var insert_datas2 = _.partial(s_exec, s_matcher_reg2, _.idtt); // {{}}

  var TAB, TAB_SIZE, REG1, REG2, REG3, REG4, REG5, REG6, REG7, REG8;
  _.TAB_SIZE = function(size) {
    TAB_SIZE = size;
    TAB = "( {" + size + "}|\\t)";
    var TABS = TAB + "+";
    REG1 = new RegExp("^" + TABS);
    REG2 = new RegExp("\/\/" + TABS + ".*?(?=((\/\/)?" + TABS + "))|\/\/" + TABS + ".*", "g");
    REG3 = new RegExp(TABS + "\\S.*?(?=" + TABS + "\\S)|" + TABS + "\\S.*", "g");
    REG4 = {}; times2(20, function(i) { REG4[i] = new RegExp(TAB + "{" + i + "}$") });
    REG5 = new RegExp("^(" + TABS + ")(\\[.*?\\]|\\{.*?\\}|\\S)+\\.(?!\\S)");
    REG6 = {}; times2(20, function(i) { REG6[i] = new RegExp("(" + TAB + "{" + i + "})", "g"); });
    REG7 = new RegExp("\\n(" + TABS + "[\\s\\S]*)");
    REG8 = new RegExp("^" + TABS + "\\|");
  };
  _.TAB_SIZE(2);

  _.template = _.t = function() { return s.apply(null, [convert_to_html].concat(_.toArray(arguments))); };
  _.template$ = _.t$ = function() { return s.apply(null, [convert_to_html, '$'].concat(_.toArray(arguments))); };
  _.string = _.s = function() { return s.apply(null, [_.idtt].concat(_.toArray(arguments))); };
  _.string$ = _.s$ = function() { return s.apply(null, [_.idtt, '$'].concat(_.toArray(arguments))); };

  function number_of_tab(a) {
    var snt = a.match(REG1)[0];
    var tab_length = (snt.match(/\t/g) || []).length;
    var space_length = snt.replace(/\t/g, "").length;
    return space_length / TAB_SIZE + tab_length;
  }
  function s(convert, var_names/*, source...*/) {
    function __PTFS__() {
      var l = arguments.length;
      while (l--) arguments[l+1] = arguments[l];
      arguments.length++;
      arguments[0] = __PTFS__;
      return _.go(mr(source, arguments, self), insert_datas1, insert_datas2, _.idtt);
    }
    var source = remove_comment(_.map(_.rest(arguments, 2), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;
      var key = _.uniqueId("f");
      __PTFS__[key] = str_or_func;
      return '__PTFS__.' + key;
    }).join(""));

    var self = { matcher: {} };
    self.matcher[s_matcher_reg1] = s_matcher(3, s_matcher_reg1, source, var_names);
    source = source.replace(s_matcher_reg1, "__PJT__");
    self.matcher[s_matcher_reg2] = s_matcher(2, s_matcher_reg2, source, var_names);
    source = convert(source.replace(s_matcher_reg2, "{{}}").replace(/__PJT__/g, "{{{}}}"));
    return __PTFS__;
  }
  function s_matcher(length, re, source, var_names) {
    return map(source.match(re), function(matched) {
      return new Function('__PTFS__' + (var_names ? ', ' : '') + var_names,
        "return " + matched.substring(length, matched.length-length) + ";");
    });
  }
  function remove_comment(source) {
    return source.replace(/\/\*(.*?)\*\//g, "").replace(REG2, "");
  }
  function s_exec(re, wrap, source, args, self) {
    var has_p = false;
    var vs = _.map(self.matcher[re], function(func) {
      var v = _.go(func.apply(null, args), wrap, return_check);
      if (thenable(v)) has_p = true;
      return v;
    });
    return _.go(mr(source.split(re), has_p && _.isArray(vs) ? _.map(vs, _.async(_.idtt)) : vs),
      function(s, vs) {
        var i = 0;
        return mr(map(vs, function(v) { return s[i++] + v; }).join("") + s[s.length-1], args, self); });
  }
  function convert_to_html(source) {
    var tag_stack = [], ary = source.match(REG3), btab = number_of_tab(ary[0]), is_paragraph = 0;
    ary[ary.length-1] = ary[ary.length-1].replace(REG4[btab] || (REG4[btab] = new RegExp(TAB+"{"+btab+"}$")), "");

    for (var i = 0; i < ary.length; i++) {
      while (number_of_tab(ary[i]) - btab < tag_stack.length) { //이전 태그 닫기
        is_paragraph = 0;
        if (tag_stack.length == 0) break;
        ary[i - 1] += end_tag(tag_stack.pop());
      }
      var tmp = ary[i];
      if (!is_paragraph) {
        ary[i] = line(ary[i], tag_stack);
        if (tmp.match(REG5)) is_paragraph = number_of_tab(RegExp.$1) + 1;
        continue;
      }
      ary[i] = ary[i].replace(REG6[is_paragraph] || (REG6[is_paragraph] = new RegExp("(" + TAB + "{" + is_paragraph + "})", "g")), "\n");
      if (ary[i] !== (ary[i] = ary[i].replace(REG7, "\n"))) ary = push_in(ary, i + 1, RegExp.$1);
    }

    while (tag_stack.length) ary[ary.length - 1] += end_tag(tag_stack.pop()); // 마지막 태그

    return ary.join("");
  }
  function line(source, tag_stack) {
    source = source.replace(REG8, "\n").replace(/^[ \t]*/, "");
    return source.match(/^[\[.#\w\-]/) ? source.replace(/^(\[.*\]|\{.*?\}|\S)+ ?/, function(str) {
      return start_tag(str, tag_stack);
    }) : source;
  }
  function push_in(ary, index, data) {
    var rest_ary = ary.splice(index);
    ary.push(data);
    return ary.concat(rest_ary);
  }
  function start_tag(str, tag_stack, attrs, name, cls) {
    attrs = '';
    name = str.match(/^\w+/);

    // name
    name = (!name || name == 'd') ? 'div' : name == 'sp' ? 'span' : name;
    if (name != 'input' && name != 'br' ) tag_stack.push(name);

    // attrs
    str = str.replace(/\[(.*)\]/, function(match, inner) { return (attrs += ' ' + inner) && ''; });

    // attrs = class + attrs
    (cls = _.map(str.match(/\.(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
    && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
      function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1, -1) : tmp) + '"'; }))
    && (attrs = ' class="' + cls + '"' + attrs);

    // attrs = id + attrs
    attrs = [''].concat(_.map(str.match(/#(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g),
        function(v) { return v.slice(1); })).join(' id=') + attrs;

    return '<' + name + attrs + ' >';
  }
  function end_tag(tag) { return '</' + tag + '>'; }
  function return_check(val) { return (val == null || val == void 0) ? '' : val; }
  // template end

  // mutable
  function _set(obj, key, vORf) {
    obj[key] = _.is_fn(vORf) ? vORf(obj[key]) : vORf;
  }
  function _unset(obj, key) {
    delete obj[key];
  }
  _.remove = _remove; function _remove(arr, remove) {
    _.removeByIndex(arr, arr.indexOf(remove)); return arr;
  }
  function _pop(arr) { arr.pop(); return arr; }
  function _shift(arr) { arr.shift(); return arr; }
  function _push(arr, itemOrFunc) {
    arr.push(_.is_fn(itemOrFunc) ? itemOrFunc(arr) : itemOrFunc);
    return arr;
  }
  function _unshift(arr, itemOrFunc) {
    arr.unshift(_.is_fn(itemOrFunc) ? itemOrFunc(arr) : itemOrFunc);
    return arr;
  }
  _.remove_by_i = _.removeByIndex = function(arr, from) {
    if (from !== -1) {
      var rest = arr.slice(from + 1 || arr.length);
      arr.length = from;
      arr.push.apply(arr, rest);
    }
    return from;
  };

  // mutable/immutable with sel
  _.sel = _.select = function f(start, sel) {
    if (arguments.length == 1) return _(f, _, start);
    return sel && _.reduce(sel.split(/\s*->\s*/), function(mem, key) {
        if (!mem || !key) return;
        return !key.match(/^\((.+)\)/) ? (!key.match(/\[(.*)\]/) ? mem[key] : function(mem, numbers) {
          if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, function(v) { return isNaN(v); }).length) return _.Err('[] sel in [num] or [num ~ num]');
          var s = numbers[0], e = numbers[1]; return !e ? mem[s<0 ? mem.length+s : s] : slice.call(mem, s<0 ? mem.length+s : s, e<0 ? mem.length+e : e + 1);
        }(mem, _.map(RegExp.$1.replace(/\s/g, '').split('~'), _.parseInt))) : _.find(mem, _.lambda(RegExp.$1));
      }, start);
  };

  _.extend(_, {
    set: function f(start, sel, val) {
      if (arguments.length == 2) return _(f, _, start, sel);
      if (arguments.length == 1) return _(f, _, start);
      var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1;
      _set(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last], val)
      return start;
    },
    unset: function(start, sel) {
      var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1;
      _unset(_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->')), _arr[last]);
      return start;
    },
    remove2: function(start, sel, remove) {
      if (remove) _remove(_.sel(start, sel), remove);
      else {
        var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1;
        var remover =_arr.length == 1 ? start : _.sel(start, _arr.slice(0, last).join('->'));
        _remove(remover, _.sel(remover, _arr[last]));
      }
      return start;
    },
    extend2: function(start, sel/*, objs*/) {
      _.extend.apply(null, [_.sel(start, sel)].concat(_.toArray(arguments).slice(2, arguments.length)));
      return start;
    },
    defaults2: function(start, sel/*, objs*/) {
      _.defaults.apply(null, [_.sel(start, sel)].concat(_.toArray(arguments).slice(2, arguments.length)));
      return start;
    },
    pop: function(start, sel) { _pop(_.sel(start, sel)); return start; },
    shift: function(start, sel) { _shift(_.sel(start, sel)); return start; },
    push: function(start, sel, item) { _push(_.sel(start, sel), item); return start; },
    unshift: function(start, sel, item) { _unshift(_.sel(start, sel), item); return start; }
  });

  _.immutable = _.im = _.extend(function(start, sel) {
    var im_start = _.clone(start);
    return {
      start: im_start,
      selected: _.reduce(sel.split(/\s*->\s*/), function(clone, key) {
        return !key.match(/^\((.+)\)/) ? /*start*/(!key.match(/\[(.*)\]/) ? clone[key] = _.clone(clone[key]) : function(clone, numbers) {
          if (numbers.length > 2 || numbers.length < 1 || _.filter(numbers, _.pipe(_.identity, isNaN)).length) return _.Err('[] sel in [num] or [num ~ num]');
          var s = numbers[0], e = numbers[1]; return !e ? clone[s] = _.clone(clone[s<0 ? clone.length+s : s]) : function(clone, oris) {
            return each(oris, function(ori) { clone[clone.indexOf(ori)] = _.clone(ori); });
          }(clone, slice.call(clone, s<0 ? clone.length+s : s, e<0 ? clone.length+e : e + 1));
        }(clone, map(RegExp.$1.replace(/\s/g, '').split('~'), parseInt)))/*end*/ :
          function(clone, ori) { return clone[clone.indexOf(ori)] = _.clone(ori); } (clone, _.find(clone, _.lambda(RegExp.$1)))
      }, im_start)
    };
  }, {
    set: function(start, sel, val) {
      var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1, im = _.im(start, _arr.slice(0, _arr.length == 1 ? void 0 : last).join('->'));
      _set(_arr.length == 1 ? im.start : im.selected, _arr[last], val);
      return im.start;
    },
    unset: function(start, sel) {
      var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1, im = _.im(start, _arr.slice(0, last).join('->'));
      _unset(_arr.length == 1 ? im.start : im.selected, _arr[last]);
      return im.start;
    },
    remove2: function(start, sel, remove) {
      var im = _.im(start, sel);
      if (remove) _remove(im.selected, remove);
      else {
        var _arr = sel.split(/\s*->\s*/), last = _arr.length - 1;
        _remove(_arr.length == 1 ? im.start : _.sel(im.start, _arr.slice(0, last).join('->')), im.selected);
      }
      return im.start;
    },
    extend: function(start/*, objs*/) {
      return _.extend.apply(null, [_.is_array(start) ? [] : {}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
    },
    defaults: function(start/*, objs*/) {
      return _.defaults.apply(null, [_.is_array(start) ? [] : {}, start].concat(_.toArray(arguments).slice(1, arguments.length)));
    },
    extend2: function(start, sel/*, objs*/) {
      var im = _.im(start, sel);
      _.extend.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length)));
      return im.start;
    },
    defaults2: function(start, sel/*, objs*/) {
      var im = _.im(start, sel);
      _.defaults.apply(null, [im.selected].concat(_.toArray(arguments).slice(2, arguments.length)));
      return im.start;
    },
    pop: function(start, sel) {
      var im = _.im(start, sel);
      _pop(im.selected);
      return im.start;
    },
    shift: function(start, sel) {
      var im = _.im(start, sel);
      _shift(im.selected);
      return im.start;
    },
    push: function(start, sel, item) {
      var im = _.im(start, sel);
      _push(im.selected, item);
      return im.start;
    },
    unshift: function(start, sel, item) {
      var im = _.im(start, sel);
      _unshift(im.selected, item);
      return im.start;
    }
  });

  function Box() {}

  _.box = function(key, val) {
    var _box_data = new Box();
    var is_string = _.isString(key), k;
    if (is_string && arguments.length == 2) _box_data[key] = val;
    else if (!is_string && arguments.length == 1) for (k in key) _box_data[k] = key[k];
    var _box = function() { return _box_data; };
    return _.extend(_box, {
      stringify: function() { return JSON.stringify(_box_data); },
      select: select,
      sel: select,
      set: function(el, val) {
        return _.set(_box_data, make_sel(el), val);
      },
      unset: function(el) {
        return _.unset(_box_data, make_sel(el));
      },
      remove2: function(el) {
        return _.remove2(_box_data, make_sel(el));
      },
      extend: function(obj) {
        return _.extend(_box_data, obj);
      },
      defaults: function(obj) {
        return _.defaults(_box_data, obj);
      },
      extend2: function(el) {
        return _.extend2.apply(null, [_box_data, make_sel(el)].concat(_.toArray(arguments).slice(1, arguments.length)));
      },
      defaults2: function(el) {
        return _.defaults2.apply(null, [_box_data, make_sel(el)].concat(_.toArray(arguments).slice(1, arguments.length)));
      },
      pop: function(el) {
        return _.pop(_box_data, make_sel(el));
      },
      push: function(el, item) {
        return _.push(_box_data, make_sel(el), item);
      },
      shift: function(el) {
        return _.shift(_box_data, make_sel(el));
      },
      unshift: function(el, item) {
        return _.unshift(_box_data, make_sel(el), item);
      },
      im: {
        set: function(el, val) {
          return _.im.set(_box_data, make_sel(el), val);
        },
        unset: function(el) {
          return _.im.unset(_box_data, make_sel(el));
        },
        remove2: function(el) {
          return _.im.remove2(_box_data, make_sel(el));
        },
        extend: function() {
          return _.im.extend.apply(null, [_box_data].concat(_.toArray(arguments)));
        },
        defaults: function() {
          return _.im.defaults.apply(null, [_box_data].concat(_.toArray(arguments)));
        },
        extend2: function(el) {
          return _.im.extend2.apply(null, [_box_data, make_sel(el)].concat(_.toArray(arguments).slice(1, arguments.length)));
        },
        defaults2: function(el) {
          return _.im.defaults2.apply(null, [_box_data, make_sel(el)].concat(_.toArray(arguments).slice(1, arguments.length)));
        },
        pop: function(el) {
          return _.im.pop(_box_data, make_sel(el));
        },
        push: function(el, item) {
          return _.im.push(_box_data, make_sel(el), item);
        },
        shift: function(el) {
          return _.im.shift(_box_data, make_sel(el));
        },
        unshift: function(el, item) {
          return _.im.unshift(_box_data, make_sel(el), item);
        }
      }
    });
    function select(el) {
      if (!el || likearr(el) && !el.length) return ;
      return _.select(_box_data, make_sel(el));
    }
    function make_sel(el) {
      return _.isString(el) ? el : function(el){
        try {
          var selector = el.getAttribute('_sel').trim();
          if (selector.indexOf('./') < 0) return selector;
          return arguments.callee(el.parentElement.closest('[_sel]')) + '->' + selector.replace('./', '');
        } catch(e) {}
      }(likearr(el) ? el[0] : el);
    }
  };

  /* Notification, Event */
  !function(_, notices) {
    _.noti = _.notice = { on: on, once: _(on, _, _ , _, true), off: off, emit: emit, emitAll: emitAll };
    function on(name1, name2, func, is_once) {
      var _notice = notices[name1];
      func.is_once = !!is_once;
      if (!_notice) _notice = notices[name1] = {};
      (_notice[name2] = _notice[name2] || []).push(func);
      return func;
    }
    function off(name1, n2_or_n2s) {
      var _notice = notices[name1];
      if (arguments.length == 1) _unset(notices, name1);
      else if (_notice && arguments.length == 2) each(_.isString(n2_or_n2s) ? [n2_or_n2s] : n2_or_n2s, _(_unset, _notice));
    }
    function emitAll(name1, emit_args) {
      var key, _notice = notices[name1];
      if (_notice) for(key in _notice) emit_loop(emit_args, _notice, key);
    }
    function emit(name, keys, emit_args) {
      !function(_notice, keys) {
        if (_notice)
          if (_.isString(keys)) emit_loop(emit_args, _notice, keys);
          else if (_.isArray(keys)) each(keys, _(emit_loop, emit_args, _notice));
      }(notices[name], _.is_fn(keys) ? keys(_.keys(notices[name])) : keys);
    }
    function emit_loop(emit_args, _notice, key) {
      _set(_notice, key, _.reject(_notice[key], function(func) {
        func.apply(null, emit_args);
        return func.is_once;
      }));
    }
  }(_, {});

  var L = window.L = _.L = {};
  function Ladd(lz, iter, scollf, siter, is_strict) {
    if (lz && lz._p_lz) {
      if (lz.is_strict && siter) lz.data = scollf(lz.data, siter);
      else if (iter) lz[lz.length] = iter;
      return lz;
    }
    var lazy, len = lz && lz.length;
    is_strict = is_strict || typeof len != 'number';
    if (iter) {
      if (is_strict) {
        lazy = [];
        lazy.data = scollf(lz, siter);
      } else {
        lazy = [iter];
        lazy.data = lz;
      }
    } else {
      lazy = [];
      lazy.data = lz;
    }
    lazy._p_lz = true;
    lazy.is_strict = is_strict;
    return lazy;
  }
  L.map = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : Ladd(lazy, { fn: iter, _p_lzt_m: true }, map, iter);
  };
  L.filter = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : Ladd(lazy, iter, filter, iter);
  };
  L.reject = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : Ladd(lazy, _.negate(iter), _.reject, iter);
  };
  L.take = function f(lazy, lmt) {
    if (!lazy || !lazy._p_lz) return function(v) { return f(v, lazy); };
    if (lazy.is_strict) {
      if (lazy.data.length > lmt) lazy.data.length = lmt || 1;
      return lazy.data;
    }
    lmt = lmt || 1;
    var res = [], i = -1, data = lazy.data, dl = data.length, ll = lazy.length, j, cur, mapv;
    loop:
      while (++i < dl) {
        j = -1, mapv = data[i];
        while (++j < ll) {
          if ((cur = lazy[j])._p_lzt_m) mapv = (cur = cur.fn)(mapv);
          else if (!cur(mapv)) continue loop;
        }
        res[res.length] = mapv;
        if (res.length == lmt) return res;
      }
    return res;
  };
  function Lloop(lazy, iter, memo, has_memo) {
    var i = -1, data = lazy.data, dl = data.length, ll = lazy.length, j, cur, mapv;
    loop:
      while (++i < dl) {
        j = -1, mapv = data[i];
        while (++j < ll) {
          if ((cur = lazy[j])._p_lzt_m) mapv = (cur = cur.fn)(mapv);
          else if (!cur(mapv)) continue loop;
        }
        if (has_memo) memo = iter(memo, mapv);
        else { memo = mapv; has_memo = true; }
        if (memo && memo.__break) return memo[0];
      }
    return memo;
  }
  L.loop = function f(lazy, iter, lm) {
    if (_.is_fn(lazy)) return arguments.length == 1 ?
      function(v) { return f(v, lazy) } : function(v) { return f(v, lazy, _.clone(iter)) };
    return Lloop(Ladd(lazy, null, null, null, false), iter, lm, arguments.length > 2);
  };
  L.find = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : Ltake1(lazy, iter)[0];
  };
  function Ltake1(lazy, iter) {
    return L.take(Ladd(lazy && lazy._p_lz && lazy.is_strict ? lazy.data : lazy, iter), 1);
  }
  L.some = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : !!Ltake1(lazy, iter || _.idtt).length;
  };
  L.every = function f(lazy, iter) {
    return _.is_fn(lazy) ? function(v) { return f(v, lazy); } : !Ltake1(lazy, iter ? _.negate(iter) : _.not).length;
  };
  L.commit = L.take(Infinity);
  L.strict = function f(list, limit) {
    return arguments.length == 1 ? function(v) { return f(v, list); } :
      Ladd(list, null, null, null, _.isNumber(limit) ? list.length < limit : limit(list));
  };

  if (typeof define === 'function' && define.amd) define('partial', [], function() { return _; });
  else if (typeof exports != 'undefined' && typeof module != 'undefined' && module.exports) module.exports = _;
  else window._ = _;
  window._p = _;
  window.__ = __;
  window.___ = ___;

  if (window.Promise) return;

  var timeoutf = typeof setImmediate == 'function' ? setImmediate : function(fn) {
    setTimeout(fn, 0);
  };
  window.Promise = function(fn) {
    tryp(fn, _.extend(this, { _state: 0, _handled: false, _value: void 0, _deferreds: [] }));
  };
  function handle(self, deferred) {
    while (self._state == 3) self = self._value;
    if (self._state == 0) return self._deferreds.push(deferred);

    self._handled = true;
    timeoutf(function() {
      var cb = self._state == 1 ? deferred.onFulfilled : deferred.onRejected, ret;
      if (!cb) return (self._state == 1 ? resovle : reject)(deferred.promise, self._value);
      try { ret = cb(self._value); }
      catch (e) { return reject(deferred.promise, e); }
      resovle(deferred.promise, ret);
    });
  }
  function resovle(self, val) {
    try {
      if (val && val instanceof Promise) finale(_.extend({ _state: 3, _value: val }));
      else if (val && typeof val.then == 'function') tryp(_.bind(val.then, val), self);
      else finale(_.extend({ _state: 1, _value: val }));
    } catch (e) { reject(self, e); }
  }
  function reject(self, val) {
    finale(_.extend(self, { _state: 2, _value: val }));
  }
  function finale(self) {
    if (self._state == 2 && self._deferreds.length == 0) timeoutf(function() {
      self._handled ||  _.loge('Possible Unhandled Promise Rejection:', self._value);
    });
    _.each(self, self._deferreds, handle);
    self._deferreds = null;
  }
  function tryp(fn, self) {
    var i = 0, err = function(val) { i++ || reject(self, val); };
    try { fn(function(val) { i++ || resovle(self, val); }, err); }
    catch (ex) { err(ex); }
  }
  Promise.prototype.then = function(onFulfilled, onRejected) {
    var promise = new Promise(function() {});
    handle(this, { onFulfilled: onFulfilled, onRejected: onRejected, promise: promise });
    return promise;
  };
  Promise.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };
  Promise.resolve = function(v) {
    return new Promise(function(rs) { rs(v); });
  };
  Promise.reject = function(v) {
    return new Promise(function(X, rj) { rj(v); });
  };
  Promise.all = PA; function PA(list) {
    return new Promise(function(rs, rj) {
      var l = list.length;
      if (!l) return rs([]);
      var list2 = Array(l);
      each(list, function res(v, i) {
        try {
          if (thenable(v)) return v.then.call(v, function(v) { res(v, i); }, rj);
          list2[i] = v;
          if (!--l) rs(list2);
        } catch (e) { rj(e); }
      });
    });
  }
  Promise.race = function(list) {
    return new Promise(function(rs, rj) { each(list, function(v) { v.then(rs, rj); }); });
  };
}(typeof global == 'object' && global.global == global && (global.G = global) || (window.G = window));