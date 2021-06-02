// 组合继承
function Animal(name) {
    this.name = name;
    this.colors = ['a','b']
}

Animal.prototype.getName = function () {
    return this.name
}

function Dog(name,age) {
    Animal.call(this,name)
    this.age = age
}

/**
 * 直接取原型对象成为自己的对象
 */
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

let dog1 = new Dog('aaa', 2)
dog1.colors.push('brown')
let dog2 = new Dog('bbb', 1)
console.log(dog2)