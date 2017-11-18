(def users [
  { :id 1 :name 'ID' :age 36 }
  { :id 2 :name 'BJ' :age 32 }
  { :id 3 :name 'JM' :age 34 }
  { :id 4 :name 'PJ' :age 27 }
  { :id 5 :name 'HA' :age 25 }
  { :id 6 :name 'JE' :age 26 }
  { :id 7 :name 'JI' :age 31 }
  { :id 8 :name 'MP' :age 23 }])

(println
 (map (fn [user] (:name user))
      (filter (fn [user] (< (:age user) 30)) users)))
;(PJ' HA' JE' MP')

;  console.log(
;    _map(user => user.age)
;      (_filter(user => user.age < 30)(users)));


(->> users
     (filter (fn [user] (< (:age user) 30)))
     (map (fn [user] (:name user)))
     println)
;(PJ' HA' JE' MP')

;  _go(users,
;    _filter(user => user.age < 30),
;    _map(user => user.name),
;    console.log);

(->> users
     (filter #(>= (:age %) 30))
     (map #(:name %))
     println)
;(ID' BJ' JM' JI')

(->> users
     (filter (fn [user] (< (:age user) 30)))
     (map (fn [user] (:age user)))
     println)
; (27 25 26 23)

(->> users
     (filter #(< (:age %) 30))
     (map #(:age %))
     (reduce +)
     println)
; 101


; 병렬 처리
(defn word-frequency1 [text]
  (->>
   (s/split text #"\s+")
   (r/map s/lower-case)
   (r/remove (fn [word] (s/starts-with? word "function")))
   (r/map (fn [word] { word 1 }))
   (r/fold (partial merge-with +))))

(defn -main []
  (time (word-frequency1 page))
  (time (word-frequency1 page))
  (time (word-frequency1 page))
  (time (word-frequency1 page)))