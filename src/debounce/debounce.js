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

/* 还有进阶版
*   支持立即执行；
    函数可能有返回值；
    支持取消功能
 */

function debounce(fn,sleep, immediate) {
    let timer = null,result;
    const debounced =  function () {
        if (timer) clearTimeout(timer)
        // 防止 this 绑定丢失
        const context = this;
        // 获取当前函数传入的参数，不能直接在 setTimeout 里使用 arguments
        const args = arguments;

        /*
            手写过后才知道 立即执行并不是第一次点击立即执行 而是每次点击都立即执行，我就说代码怎么这么奇怪。。。
         */
        if (immediate){
            let canCall = !timer;
            timer = setTimeout(()=>timer = null,sleep)
            if (canCall) result = fn.apply(context, args)
        }else {
            timer = setTimeout(()=>{
                // 这里不必将返回值赋值给 result , 因为是异步，这个函数执行完 result 也还是原来的
                // https://github.com/mqyqingfeng/Blog/issues/22
                fn.apply(context, args)
            },sleep)
        }
        return result;
    }

    debounced.cancel = function () {
        clearTimeout(timer);
        timer = null;
    }

    return debounced
}
