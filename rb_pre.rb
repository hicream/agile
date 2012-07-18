class Pet
    attr_accessor :name, :age, :gender, :color
end
class Cat < Pet
end
class Dog < Pet
end
class Snake < Pet
end

snake_ins = Snake.new
snake_ins.length = 10
puts snake_ins.length
