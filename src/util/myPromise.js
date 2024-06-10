
class myPromise {
    constructor(executor) {
        this.promiseState = 'pending'
        this.promiseResult = null

        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        // console.log(this, 'this')
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)

        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }

        
    }


    resolve(value) {
        // console.log(this, 'resolve')
        if(this.promiseState != 'pending') return

        this.promiseState = 'fulfilled'
        this.promiseResult = value

        while(this.onFulfilledCallbacks.length > 0) {
            this.onFulfilledCallbacks.shift()(this.promiseResult)
        }
    }

    reject(reason) {
        if(this.promiseState != 'pending') return

        this.promiseState = 'rejected'
        this.promiseResult = reason

        while(this.onRejectedCallbacks.length > 0) {
            this.onRejectedCallbacks.shift()(this.promiseResult)
        }
    }

    then(onFulfilled, onRejected) {
        // 判断是否是函数
        onFulfilled = typeof onFulfilled == 'function'? onFulfilled: value => value
        onRejected = typeof onRejected == 'function'? onRejected: err => { throw err }

        // then 链式调用
        var thenPromise = new myPromise((resolve, reject) => {
            const resolvePromise = cb => {
                 try {
                
                    const x = cb(this.promiseResult)    // 这里已经执行了回调函数
                    if(x === thenPromise) {
                        throw new Error('不能返回自身')
                    }
                    if(x instanceof myPromise) {
                        x.then(resolve, reject)
                    }
                    else {
                        // console.log(x, 'eee')
                        resolve(x)
                        // reject(x)
                    }
                
                } catch (err) {
                    reject(err)
                    throw new Error(err)
                }
            }
            if(this.promiseState == 'fulfilled') {
                // onFulfilled(this.promiseResult)
                resolvePromise(onFulfilled)
            }
            else if(this.promiseState == 'rejected') {
                // onRejected(this.promiseResult)
                resolvePromise(onRejected)
            }
            else if(this.promiseState == 'pending') {
                // this.onFulfilledCallbacks.push(onFulfilled.bind(this))
                // this.onRejectedCallbacks.push(onRejected.bind(this))
                this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
            }
        })

        return thenPromise
        
    }

    catch(onReject) {
        return this.then(null, onReject)
    }

}

const test = new myPromise((resolve, reject) => {
    // setTimeout(() => {
        resolve('success')
        // reject('fail')
    // }, 3000)
}).then(function(res) {
    console.log('then ', res, 0)
    // return '222'
    let that = this
    return that
}, err => {
    console.log(err, '111 err')
    return '第二次 then 返回值'
}).then(r => {
    console.log(r, 'rrr')
})

// const onF = (res) => {
//     console.log(res, '1')
//     return onF
// }

// new myPromise((resolve, reject) => {
//     // setTimeout(() => {
//         resolve('su')
//         // reject('fail')
//     // }, 3000)
// }).then(onF)






// new Promise((resolve, reject) => {
//     reject('promise reject')
// }).then(res => {
//     console.log(res, 'promise then')
// }, err => {
//     console.log(err, 'err')
//     throw new Error(err)
// }).then(res => {
//     console.log(res, 'promise res 222')
// }, err => {
//     console.log(err, 'promise err 222')
// })


// const test1 = new myPromise((resolve, reject) => {
//     reject('fail')
// })

// console.log(test1)