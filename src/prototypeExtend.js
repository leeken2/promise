// 原型链继承
function Animal(mycolor) {
    this.colors = mycolor|| ['b','c']
}

Animal.prototype.getColor = function () {
    return this.colors
}

function Dog() {}

Dog.prototype = new Animal()

/**
 * 1.原型上的引用类型属性会被所有实例共享
 * 2.子类实例化不能传参
 */
let dog1 = new Dog()
dog1.colors.push('brown')
let dog2 = new Dog()
console.log(dog2.colors) // ['black', 'white', 'brown']
