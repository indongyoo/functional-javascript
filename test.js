var users = [
  { id: 1, name: "ID", age: 36 },
  { id: 2, name: "BJ", age: 32 },
  { id: 3, name: "JM", age: 32 },
  { id: 4, name: "PJ", age: 27 },
  { id: 5, name: "HA", age: 25 },
  { id: 6, name: "JE", age: 26 },
  { id: 7, name: "JI", age: 31 },
  { id: 8, name: "MP", age: 23 }
];

// // 1. 명령형 코드
// // 1. 30세 이상인 users를 거른다.
// var temp_users = [];
// for (var i = 0; i < users.length; i++) {
//   if (users[i].age >= 30) {
//     temp_users.push(users[i]);
//   }
// }
// console.log(temp_users);

// var temp_users = [];
// temp_users = _filter(users, function(user) {
//   return user.age >= 30;
// });
// console.log(temp_users, "changed");

// // 2. 30세 이상인 users의 names를 수집한다.
// var names = [];
// for (var i = 0; i < temp_users.length; i++) {
//   names.push(temp_users[i].name);
// }
// console.log(names);

// var names = _map(temp_users, function(user) {
//   return user.name;
// });
// console.log(names, "changed");

// // 3. 30세 미만인 users를 거른다.
// var temp_users = [];
// for (var i = 0; i < users.length; i++) {
//   if (users[i].age < 30) {
//     temp_users.push(users[i]);
//   }
// }
// console.log(temp_users);

// var temp_users = [];
// temp_users = _filter(users, function(user) {
//   return user.age < 30;
// });
// console.log(temp_users, "changed");

// // 4. 30세 미만인 users의 ages를 수집한다.
// var ages = [];
// for (var i = 0; i < temp_users.length; i++) {
//   ages.push(temp_users[i].age);
// }
// console.log(ages);

// var ages = _map(temp_users, function(user) {
//   return user.age;
// });
// console.log(ages, "changed");

var sub = _curryr(function(a, b) {
  return a - b;
});
console.log(sub(5, 1));

var sub10 = sub(10);
console.log(sub10(15));

var user1 = users[0];
console.log(_get("name")(user1));

//_get 만들어 좀 더 간단하게 하기

console.log(
  _map(
    _filter(users, function(user) {
      return user.age >= 30;
    }),
    _get("name")
  )
);

console.log(
  _map(
    _filter(users, function(user) {
      return user.age < 30;
    }),
    _get("age")
  )
);
