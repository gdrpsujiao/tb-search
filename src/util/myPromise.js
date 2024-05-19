
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
                
                    const x = cb(this.promiseResult)
                    if(x === thenPromise) {
                        throw new Error('不能返回自身')
                    }
                    if(x instanceof myPromise) {
                        x.then(resolve, reject)
                    }
                    else {
                        resolve(x)
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

}

new myPromise((resolve, reject) => {
    // setTimeout(() => {
        resolve('success')
    // }, 3000)
}).then(res => {
    console.log('then ', res, 0)
    return '222'
}).then(res => {
    console.log('then ', res, 1)
})


// const test1 = new myPromise((resolve, reject) => {
//     reject('fail')
// })

// console.log(test1)