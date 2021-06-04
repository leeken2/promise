function isObject(obj) {
    return typeof obj === 'object' && obj !==null
}

// hash 用来保存出现过的 object, 用来解决循环引用
function deepClone(source,hash=new WeakMap()) {

    // 基础类型 直接返回; typeof null 会返回 object，所以封装个函数
    if (!isObject(source)) return source;

    if (hash.get(source)) return source;
    hash.set(source,true)

    const target = Array.isArray(source)?[]:{}

    for(let key in source){
        if (source.hasOwnProperty(key)){
            if (typeof source[key] === 'object'){
                target[key] = deepClone(source[key],hash)
            }else {
                target[key] = source[key]
            }
        }
    }

    return target;
}

// 测试用例
var a = {
    name: "muyiy",
    book: {
        title: "You Don't Know JS",
        price: "45"
    },
    a1: undefined,
    a2: null,
    a3: 123
}

a.circleRef = a;

var b = deepClone(a);
console.log(b);