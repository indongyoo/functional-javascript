/* 3.2절까지의 코드 */
var _ = {};

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var isArrayLike = function(list) {
  var length = list && list.length;
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
_.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};
_.keys = function(obj) {
  return _.isObject(obj) ? Object.keys(obj) : [];
};

function bloop(new_data, body, stopper) {
  return function(data, iter_or_predi) {
    iter_or_predi = iter_or_predi || _.idtt;
    var result = new_data(data);
    var memo;
    if (isArrayLike(data)) {
      for (var i = 0, len = data.length; i < len; i++) {
        memo = iter_or_predi(data[i], i, data);
        if (!stopper) body(memo, result, data[i], i);
        else if (stopper(memo)) return body(memo, result, data[i], i);
      }
    } else {
      for (var i = 0, keys = _.keys(data), len = keys.length; i < len; i++) {
        memo = iter_or_predi(data[keys[i]], keys[i], data);
        if (!stopper) body(memo, result, data[keys[i]], keys[i]);
        else if (stopper(memo)) return body(memo, result, data[keys[i]], keys[i]);
      }
    }
    return result;
  }
}

_.idtt = _.identity = function(v) { return v; };
_.args0 = _.identity;
_.args1 = function(a, b) {
  return b;
};
_.array = function() { return [] };
_.push_to = function(val, obj) {
  obj.push(val);
  return val;
};
_.noop = function() {};

_.each = bloop(_.identity, _.noop);
_.map = bloop(_.array, _.push_to);
_.values = function(list) {
  return _.map(list, _.identity);
};

/* 3.3 */
_.if = _.safety = _.with_validator = _.planB = function(validator, func, alter) {
  return function() {
    return validator.apply(null, arguments) ?
      func.apply(null, arguments) :
    alter && alter.apply(null, arguments);
  }
};

_.toArray = _.if(Array.isArray, _.idtt, _.values);

_.rest = function(list, num) {
  return _.toArray(list).slice(num || 1);
};

_.rester = function(func, num) {
  return function() {
    return func.apply(null, _.rest(arguments, num));
  }
};

_.reverse = function(list) {
  return _.toArray(list).reverse();
};

_.constant = function(v) {
  return function() {
    return v;
  }
};

_.isNumber = function(a) { return toString.call(a) == '[object Number]'; };

_.push = function(obj, val) {
  obj.push(val);
  return obj;
};
_.not = function(v) { return !v }

_.filter = bloop(_.array, _.if(_.idtt, _.rester(_.push)));
_.reject = bloop(_.array, _.if(_.not, _.rester(_.push)));
_.find = bloop(_.noop, _.rester(_.idtt, 2), _.idtt);
_.findIndex = bloop(_.constant(-1), _.rester(_.idtt, 3), _.idtt);
_.findKey = bloop(_.noop, _.rester(_.idtt, 3), _.idtt);
_.some = bloop(_.constant(false), _.constant(true), _.idtt);
_.every = bloop(_.constant(true), _.constant(false), _.not);