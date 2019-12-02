function addMaker(a) {
  return function(b) {
    return a + b;
  };
}

/*
    함수형 프로그래밍과 객체지향 프로그래밍의 차이는
    객체를 확장하느냐 객체를 다루는 함수를 늘리느냐의 차이이며 추상화의 단위가 클래스이냐 함수이냐의 차이다.
*/

// predicate : 매개값을 조사해서 true 또는 false를 리턴하는 역할 출처: https://palpit.tistory.com/673
function _filter(list, predicate) {
  var new_list = [];
  _each(list, function(val) {
    if (predicate(val)) new_list.push(val);
  });
  return new_list;
}

function _map(list, mapper) {
  var new_list = [];
  _each(list, function(val) {
    new_list.push(mapper(val));
  });
  return new_list;
}

function _each(list, iter) {
  for (var i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
}

//Haskell Curry 이름에서 유래 출처: https://itholic.github.io/haskell-function1-currying/
function _curry(fn) {
  return function(a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function(b) {
          return fn(a, b);
        };
  };
}

function _curryr(fn) {
  return function(a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function(b) {
          return fn(b, a);
        };
  };
}

var _get = _curryr(function(obj, key) {
  return obj == null ? undefined : obj[key];
});
