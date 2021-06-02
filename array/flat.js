
function flatten(arr) {
    let result = [];
    for (let i = 0;i < arr.length; i++){
        // 跳出条件
        if (Array.isArray(arr[i])){
            // 使用递归函数的返回值与当前参数进行计算
            result = result.concat(flatten(arr[i]))
        }else {
            result.push(arr[i])
        }
    }
    return result
}

function flattenES6(arr){
    while (arr.some(item=>Array.isArray(item))){
        arr = [].concat(...arr)
    }
}

console.log(flatten([1, [2, [3]]]))