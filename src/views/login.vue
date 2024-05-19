<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'

import { doLogin } from '@/api/taobao'


const router = useRouter()

const username = ref()
const password = ref()

const onLogin = () => {
    // console.log(username.value, password.value)
    network().requestLogin()
}

const handlerRouterSujiao = () => {
    window.location.href = 'https://gdrpsujiao.github.io'
}

const network = () => {
    return {
        requestLogin: async () => {
            // console.log('request login', username.value, password.value)
            const { data } = await doLogin({
                userName: username.value,
                password: password.value,
                remember: true,
                from: ''
            })
            // console.log(data)
            const { ok, res } = data
            if(ok && res) {
                // 登录成功
                // console.log('success')
                router.replace('/')
            }
            else {
                showNotify({
                    type: 'danger',
                    message: '错了错了'
                })
            }
        }
    }
}

</script>

<template>
    <section class="login-page-container">
        <section class="login-container">
            <!-- <div class="login-box"> -->
                <van-field v-model="username" placeholder="账号" />
                <van-field type="password" v-model="password" placeholder="密码" />
                <van-button type="primary" block @click="onLogin">登录</van-button>
            <!-- </div> -->
        </section>
        <footer>
            <span @click="handlerRouterSujiao">去计算器页面</span>
        </footer>
    </section>
</template>

<style lang="scss" scoped>
.login-page-container {
    // position: relative;
    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 30px;
        width: 500px;
        max-width: 80%;
        // border: 1px solid black;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        transform: translate(-50%, -50%);
        .van-field {
            margin-bottom: 30px;
        }
    }
    footer {
        position: absolute;
        bottom: 50px;
        left: 50%;
        text-align: center;
        transform: translateX(-50%);
        span {
            font-size: 14px;
            color: $primary;
            text-decoration: underline;
        }
    }
}
</style>