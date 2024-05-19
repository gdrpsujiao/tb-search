import axios from 'axios'
import router from '../router'
import env from '../../env'
import { showNotify } from 'vant'
// import env from '../env.js'
// const env = require('../env.js')

//允许携带 headers cookie
// axios.defaults.withCredentials = true

const instance = axios.create({
    timeout: 10000
})


instance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(res => {
    // 处理
    const { data } = res
    const { needWarnLogin } = data
    if(needWarnLogin) {
        router.replace('/login')
    }

    // console.log(res)
    // debugger
    return Promise.resolve(res)

}, error => {
    console.log(error, 'axios err')
    const { message, code } = error
    if(code == 'ECONNABORTED' && message) {
        // 超时
        showNotify({
            type: 'danger',
            message: '请求超时，稍后重试'
        })
    }

    return Promise.reject(error)
})


const Axios = (options = {}) => {
    return new Promise((resolve, reject) => {
        const { url } = options
        const isTaobao = url.indexOf('/taobao/') == 0
        const resultUrl = isTaobao? url: `${env.BASE_URL}${url}`
        // debugger
        instance({
            ...options,
            // url: env.BASE_URL + options.url
            url: resultUrl
        }).then(res => {
            // if(isTaobao) {
            //     const { data } = res
            //     const { needWarnLogin } = data
            //     if(needWarnLogin) {
            //         // 跳转登录
            //         router.replace('/login')
            //         reject(res)
            //     }
            // }
            resolve(res)
        }).catch(err => {
            console.log(err, 'err')
            const response = err.response
            const { status, data } = response
            if(err && response && status !== 200) {
                showNotify({
                    type: 'danger',
                    message: '服务器异常，稍后重试'
                })
            }
            reject(err)
        })
    })
}


export {
    Axios as axios
}