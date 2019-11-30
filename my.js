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
function filter(list, predicate) {
  var new_list = [];
  for (var i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) new_list.push(list[i]);
  }
  return new_list;
}

function map(list, iteratee) {
  var new_list = [];
  for (var i = 0, len = list.length; i < len; i++) {
    new_list.push(iteratee(list[i]));
  }
  return new_list;
}
