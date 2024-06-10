

const defineReactive = (obj, key, val) => {
    // 递归遍历子属性
    observable(val)
    var dep = new Dep()

    Object.defineProperty(obj, key, {
        enumerable: true,   // 可枚举
        configurable: true, //  可配置
        get() {
            if(Dep.target) {
                dep.addSub(Dep.target)
            }
            return val
        },
        set(newVal) {
            val = newVal
            console.log(`ket-${key}: ${newVal}`)
            dep.notify()
        }
    })
}

const observable = obj => {
    if(!obj || typeof obj !== 'object') return

    let keys = Object.keys(obj)
    keys.forEach((key) => {
        defineReactive(obj, key, obj[key])
    })
    
    return obj
}


function Dep() {
    this.subs = []
}

Dep.prototype = {
    addSub(sub) {
        this.subs.push(sub)
    },
    notify() {
        this.subs.some(sub => {
            sub.update()
        })
    }
}

Dep.target = null

function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get()
}

Watcher.prototype = {
    update() {
        this.run()
    },
    run() {
        let value = this.vm.data[this.exp]
        let oldValue = this.value
        if(value !== oldValue) {
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    },
    get() {
        Dep.target = this
        let value = this.vm.data[this.exp]
        Dep.target = null
        return value
    }
}

function Compile (options, vm) {
    const { el } = options
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    // debugger
    this.init()
}

Compile.prototype = {
    init() {
        if(this.el) {
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
            // debugger
        }
        else {
            console.log('Dom 不存在')
        }
    },
    nodeToFragment(el) {
        let fragment = document.createDocumentFragment()
        let child = el.firstChild
        while(child) {
            fragment.appendChild(child)
            child = el.firstChild
        }
  
        return fragment
    },
    compileElement(el) {
        let childNodes = el.childNodes
        let self = this
        let arr = []
    
        arr.slice.call(childNodes).some(node => {
            let reg = /\{\{(.*)\}\}/
            let text = node.textContent

            if(self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, reg.exec(text)[1].trim())
            }
            if(node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }
        })
    },
    compileText(node, exp) {
        let self = this
        let initText = this.vm[exp]
        this.updateText(node, initText)
        new Watcher(this.vm, exp, function(value) {
            self.updateText(node, value)
        })
        // debugger
    },
    updateText(node, value) {
        node.textContent = typeof value == 'undefined'? '': value
    },
    isTextNode(node) {
        // debugger
        return node.nodeType == 3
    }
}








function aVue(options) {

    let self = this
    this.vm = this
    this.data = options.data
    this.methods = options.methods

    Object.keys(this.data).some(key => {
        self.proxyKeys(key)
    })

    // Object.keys(this.methods).some(key => {
    //     self.proxyKeys(key)
    // })

    observable(this.data)

    new Compile(options, this.vm)
    
    // return this
    options.mounted.call(this) // 执行 mounted
}

aVue.prototype = {
    proxyKeys(key) {
        let self = this
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get() {
                return self.data[key]
            },
            set(newVal) {
                self.data[key] = newVal
            }
        })
    },
    // proxyMethods(key) {
    //     let self = this
    //     Object.defineProperty(this, key, {
    //         enumerable: true,
    //         configurable: true,
    //         get() {
    //             return self.methods[key].bind(self)
    //         }
    //     })
    // }
}


