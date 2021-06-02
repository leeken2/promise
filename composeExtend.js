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
 *  解决了构造函数继承的方法不能复用的问题
 *  可以让原型上的方法可以复用 每个实例有自己的属性
 *
 */
Dog.prototype = new Animal()
Dog.prototype.constructor = Dog

let dog1 = new Dog('aaa', 2)
dog1.colors.push('brown')
let dog2 = new Dog('bbb', 1)
console.log(dog2)