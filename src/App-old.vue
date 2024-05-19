<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
// import env from '../env'

import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

import { getTest } from '@/api/test'
import { doLogin, findUser } from '@/api/taobao'

const store = useStore()

const test = ref('APeng')
const test1 = reactive('APeng1')

const t = ref({
  text: 'APeng'
})

const t1 = reactive({
  text: 'APeng1'
})

// function onClickTest ()  {
//   test.value = `${test.value} APeng `
//   console.log(1)
// }

const onClickTest = () => {
  test.value = `${test.value} APeng`
  console.log(2)
}

const handlerEmitText = (value) => {
  console.log('emit', value)

  // vuex 
  // store.dispatch('test/setStoreTest', value)
  store.commit('test/SET_STORE_TEST', value)

  console.log(store.state.test)
}

const sss = ref()

const obj = { a: 1 }
const o1 = reactive(obj)
const o2 = ref(obj)


onMounted(() => {
  // console.log('ttt', env.API_ROOT)
  // getTest().then(res => {
  //   const { data } = res
  //   console.log(data, 'testttt')
  // })
  // getTestData()
  // console.log(store.state.test, '==')
  // const { storeTest } = store.state.test
  // console.log(storeTest, '== test')
  console.log(t.value.text)
  console.log(t1.text)
  // obj.a = 2
  // o1.value.a = 3
  let { a } = o1
  a = 4
  
  console.log(o1, o2.value)

  // testLogin()
  testFindUser()

})


const getTestData = async () => {
  const { data } = await getTest()

  console.log(data, '测试 async await')
}

const testLogin = async () => {
  const res = await doLogin({
    userName: 'tbapeng',
    password: 'tbapeng',
    remember: false,
    from: ''
  })
  console.log(res, 'login')
  // 获取 cookie

}

const testFindUser = async () => {
  const res = await findUser({}, {
    // Cookie: 'PLAY_SESSION=ap'
  })

  console.log(res, 'find user')
}


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <div class="test global-common" @click="onClickTest">{{ test }} {{ sss }}</div>
      <HelloWorld 
        msg="You did it!!!!" 
        v-model:modelValue="sss"
        @emitText="handlerEmitText" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}



.test {
  cursor: pointer;

  // color: $blue;

  display: flex;
  justify-content: center;
  align-items: center;
}

// $blue: blue;


@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
