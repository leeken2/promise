const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object')
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Reject = 'reject'

function Promise(fn) {
    this.state = Pending
    this.result = null
    this.callbacks = []

    let onFulfilled = value => transition(this, Fulfilled, value)
    let onRejected = reason => transition(this, Reject, reason)

    /**
     *  resolve / reject 可能会调用多次， ignore用来防止多次调用

        eg:
        new Promise((r,j)=>{
            setTimeout(()=>r('a'),1000)
            r('a')
            j('a')
        })

     * */
    let ignore = false
    let resolve = value =>{
        if (ignore) return;
        ignore = true
        resolvePromise(this, value, onFulfilled, onRejected)
    }

    let reject = reason =>{
        if (ignore) return;
        ignore = true;
        onRejected(reason)
    }

    try{
        fn(resolve, reject)
        console.log('exec fn',this.callbacks,this.state)
    }catch (e) {
        reject(e)
    }
}

const handleCallbacks = (callbacks,state,result)=>{
    while (callbacks.length) handleCallback(callbacks.shift(),state,result)
}

const transition = (promise,state,result)=>{
    /**
     *  只有 Pending 状态，能迁移为其他状态
     */
    console.log('exec transition', promise.state)
    if (promise.state !== Pending) return;
    promise.state = state;
    promise.result = result;
    // 状态变更，清空回调
    setTimeout(()=>handleCallbacks(promise.callbacks,state,result),0)
}

Promise.prototype.then= function (onFulfilled,onRejected) {
    return new Promise((resolve,reject)=>{
        let callback = { onFulfilled, onRejected, resolve, reject};

        /**
         * 上一个 promise 尚未完成，则保存回调，待状态改变时调用；
         */
        if (this.state === Pending){
            this.callbacks.push(callback)
        }else {
            setTimeout(()=>handleCallback(callback,this.state,this.result),0)
        }
    })
}

const handleCallback = (callback,state,result)=>{
    let { onFulfilled, onRejected, resolve, reject } = callback
    /**
     *  执行回调，如果是非函数，发生值穿透，resolve 上一个promise的值；
     *
     *  onFulfilled(result) / onRejected(result) 代表处理当前 promise 的值；
     *
      */
    try{
        if (state === Fulfilled){
            isFunction(onFulfilled)?resolve(onFulfilled(result)):resolve(result)
        }else if (state === Reject){
            isFunction(onRejected)?resolve(onRejected(result)):reject(result)
        }
    }catch (e) {
        reject(e)
    }
}

const resolvePromise = (promise, result, resolve, reject)=>{
    if (result === promise){
        let reason = new TypeError('Can not fufill promise with itself')
        return reject(reason)
    }

    if (isPromise(result)){
        return result.then(resolve, reject)
    }

    if (isThenable(result)){
        try{
            let then = result.then
            if (isFunction(then)){
                return new Promise(then.bind(result)).then(resolve,reject)
            }
        }catch (e) {
            return reject(e)
        }
    }

    resolve(result)
}

Promise.resolve = value => new Promise(resolve => resolve(value))
Promise.reject = reason => new Promise((_, reject) => reject(reason))

module.exports = Promise

new Promise((r,j)=>{
    // setTimeout(()=>r('a'),5000)
    r('a')
}).then(r=>{
    console.log('one',r)
}).then(r=>{
    console.log('two',r)
}).then(r=>{
    console.log('three',r)
})

console.log('window')

/**
 1. promise 执行 fn 即执行：
     (r,j)=>{
        // setTimeout(()=>r('a'),5000)
        r('a')
    }

 2. r,j 代表会更改状态的回调
    既 ： promise.js:15 和 promise.js:16
    一切状态变更的起点

 3. 1执行完后，调用了 r , 将当前 promise 状态为 fulfilled, 然后执行 then 函数

 4. then 发现 上一个 promise 的状态为 fulfilled ,即上一个 promise 已完成，异步调用回调，返回一个 状态为 pending 的新 promise
    当前队列 为 [
         r=>{
            console.log('one',r)
        },
    ]
    实际代码为： setTimeout(()=>handleCallback(callback,this.state,this.result),0) ; //promise.js:75

 5. 继续执行新 promise 的 then , 因为上一个状态为 pending , then 将回调放入 callbacks , 返回一个 状态为 pending 的新 promise
    promise.callbacks = [
         r=>{
            console.log('two',r)
        }
    ]
    实际代码为： this.callbacks.push(callback); //promise.js:74

 6. 继续执行新 promise 的 then, 状态仍为 pending , then 将回调放入 callbacks,
     promise.callbacks = [
         r=>{
            console.log('three',r)
        }
     ]
    实际代码为： this.callbacks.push(callback); //promise.js:74

 7. then 链执行完毕 ，执行 console.log('window')

 8. 同步代码执行完毕，从 4. 中的队列取出任务，handleCallback 调用 resolve(onFulfilled(result)) / resolve(onRejected(result)) ,resolve 会将 4. 中返回的 promise 状态改变为 fulfilled
    onFulfilled(result)
    即调用
    r=>{
        console.log('one',r)
    }
    输出 one a ....... r 的值忘记分析了。。。

    resolve 会调用 transition ，状态改变前为 pending ，执行完毕变为 fulfilled ;
    transition 会清空 callbacks ，即执行 5. 添加在 4. promise.callbacks 上的回调
    r=>{
        console.log('two',r)
    }
    输出 two undefined ....... r 的值忘记分析了。。。

    。。。

    输出 three undefined ......

    。。。
 
    callbacks 里的回调总是被下一个 promise 的 resolve 包裹，所以会不断触发回调，直至 callbacks 为空
 */