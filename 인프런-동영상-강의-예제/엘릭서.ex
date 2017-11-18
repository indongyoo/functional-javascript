defmodule Console do
    def log(v) do
        IO.puts(inspect(v))
    end
end

users = [
    %{ id: 1, name: 'ID', age: 36 },
    %{ id: 2, name: 'BJ', age: 32 },
    %{ id: 3, name: 'JM', age: 34 },
    %{ id: 4, name: 'PJ', age: 27 },
    %{ id: 5, name: 'HA', age: 25 },
    %{ id: 6, name: 'JE', age: 26 },
    %{ id: 7, name: 'JI', age: 31 },
    %{ id: 8, name: 'MP', age: 23 }
]

filtered = Enum.filter(users, fn u -> u.age >= 30 end);
Console.log(filtered);

# [%{age: 36, id: 1, name: 'ID'},
#  %{age: 32, id: 2, name: 'BJ'},
#  %{age: 34, id: 3, name: 'JM'},
#  %{age: 31, id: 7, name: 'JI'}]


Console.log(
    Enum.map(
        Enum.filter(users, fn user -> user.age >= 30 end),
        fn user -> user.name end))
# ['ID', 'BJ', 'JM', 'JI']

# console.log(
#   _map(
#     _filter(users, function(user) { return user.age >= 30; }),
#     function(user) { return user.name; }));


users
    |> Enum.filter(&(&1.age >= 30))
    |> Enum.map(&(&1.name))
    |> Console.log
    # ['ID', 'BJ', 'JM', 'JI']

#  _go(users,
#    _filter(u => u.age >= 30),
#    _map(u => u.name),
#    console.log);


users
    |> Enum.filter(&(&1.age < 30))
    |> Enum.map(&(&1.age))
    |> Console.log
    # [27, 25, 26, 23]

users
    |> Enum.filter_map(&(&1.age < 30), &(&1.age))
    |> Console.log
    # [27, 25, 26, 23]

users
    |> Enum.filter_map(&(&1.age < 30), &(&1.age))
    |> Enum.reduce(&(&1 + &2))
    |> Console.log
    # 121

users
    |> Enum.filter(&(&1.age < 30))
    |> Enum.map_reduce(0, fn(u, total) -> {u.age, u.age + total} end)
    |> Console.log
    # {[27, 25, 26, 23], 101}