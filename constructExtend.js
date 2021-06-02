// 构造函数实现继承
function AnimalB(name) {
    this.name = name
    this.getName = () => {
        console.log(this,this.name)
        return this.name
    }
}

function DogB(name) {
    AnimalB.call(this,name)
}
DogB.prototype = new AnimalB()

/**
 *  解决 原型链继承的两个问题；
 *  1. 每次创建都会创建一次方法
 */
const dogb = new DogB('bobo')
dogb.getName()

// 温习箭头函数的 this 指向
name = 'window'
const animalB = {
    name:'bb',
    getName:()=>{
        console.log(this,this.name) // 浏览器环境应该输出 Window（object）, window
        this.name
    }
}
animalB.getName()