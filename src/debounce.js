// 简单版
function debounce(fn,time) {
    let timer = null;
    return function () {
        if (timer) clearTimeout(null)
        timer = setTimeout(fn,timer)
    }
}

// 可以传入参数
function debounce(fn,time) {
    let timer = null;
    return function () {
        if (timer) clearTimeout(null)
        // 防止 this 绑定丢失
        const context = this;
        // 获取当前函数传入的参数，不能直接在 setTimeout 里使用 arguments
        const args = arguments;
        timer = setTimeout(()=>{
            fn.apply(context, args)
        },time)
    }
}