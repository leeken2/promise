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
    }catch (e) {
        reject(e)
    }
}

const handleCallbacks = (callbacks,state,result)=>{
    while (callbacks.length) handleCallback(callbacks.shift(),state,result)
}

const transition = (promise,state,result)=>{
    if (promise.state !== Pending) return;
    promise.state = state;
    promise.result = result;
    setTimeout(()=>handleCallbacks(promise.callbacks,state,result),0)
}



Promise.prototype.then= function (onFulfilled,onRejected) {
    return new Promise((resolve,reject)=>{
        let callback = { onFulfilled, onRejected, resolve, reject};

        if (this.state === Pending){
            this.callbacks.push(callback)
        }else {
            setTimeout(()=>handleCallback(callback,this.state,this.result),0)
        }
    })
}

const handleCallback = (callback,state,result)=>{
    let { onFulfilled, onRejected, resolve, reject } = callback
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