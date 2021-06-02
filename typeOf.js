function typeOf(obj) {
    const type = Object.prototype.toString.call(obj).split(' ')[1]
    // str.substring(indexStart[, indexEnd]) indexEnd 代表的字符不包括在内
    return type.substring(0,type.length - 1).toLowerCase();
}

console.log(typeOf([]))
console.log(typeOf({}))
console.log(typeOf(new Date))
