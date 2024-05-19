<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { 
    getRenderData,
    getAllSearchList,
    getQuickSearch,
    getDetailInfo,
    getDetailSearchInfo,
    getSearchDetailInfo } from '@/api/taobao'
import { showNotify } from 'vant'

const router = useRouter()

let renderData = ref({
    todayLeftFreeNum: 0,
    freeNumEveryDay: 0
})
let searchList = ref([])

const pageCount = ref(1)
const search = ref()
const showDialog = ref(false)
const searchDetail = ref({})  // 照妖详情
const detailInfo = ref(null)

let total = computed(() => {
    return renderData.value.freeNumEveryDay
})

let freeTotal = computed(() => {
    return renderData.value.todayLeftFreeNum
})

const searchDetailData = computed(() => {
    const { data, msg } = searchDetail.value
    if(!data || data.length == 0) return {}
    return {
        ...data[0],
        msg
    }
})

const searchDetailInfo = computed(() => {
    // if(!searchDetailData) return false

    const { 
        msg = 0, 
        chaping = 0, 
        dajia = 0, 
        paodan = 0, 
        pianzi = 0, 
        pitu = 0, 
        qiaozha = 0, 
        taoke = 0, 
        xujia = 0 } = searchDetailData.value || {}
    return [
        {
            label: '降权处置',
            value: msg,
        },
        {
            label: '跑单',
            value: paodan
        },
        {
            label: '骗子',
            value: pianzi
        },
        {
            label: '差评',
            value: chaping
        },
        {
            label: '打假',
            value: dajia
        },
        {
            label: '敲诈',
            value: qiaozha
        },
        {
            label: '虚假交易',
            value: xujia
        },
        {
            label: '淘客',
            value: taoke
        },
        {
            label: 'P图',
            value: pitu
        },
    ]
})

// const detailShowInfo = computed(() => {

// })

onMounted(() => {
    // 判断登录状态
    const result = checkLogin()
    if(!result) return

    network().getRenderInfo()
    network().getAllSearchListInfo()

    // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
})

const checkLogin = () => {
    const cookie = document.cookie
    const result = cookie.indexOf('_sid_') != -1 && cookie.indexOf('PLAY_SESSION') != -1
    if(!result) {
        showNotify({
            type: 'warning',
            message: '请先登录'
        })
        router.replace('/login')
    }
    return result
}

const onLogout = () => {
    cleanAllCookie()
    router.replace('/login')
}

const onQuickSearch = () => {
    detailInfo.value = null
    // showDialog.value = true
    network().getQuickSearchInfo()
}

const onDetailSearch = () => {
    network().getSearchDetailInfoData()
}

const onDetail = (id) => {
    network().getDetailInfoData(id)
}

const handlerCloseDialog = () => {
    // 关闭重置 详情 detail 
    detailInfo.value = null
    // debugger
}

const handlerRouterSujiao = () => {
    window.location.href = 'https://gdrpsujiao.github.io'
}

const network = () => {
    return {
        getRenderInfo: async () => {
            const { data } = await getRenderData()
            const { ok, res } = data
            if(ok) {
                // const { todayLeftFreeNum, freeNumEveryDay } = res
                // renderData.value.todayLeftFreeNum = todayLeftFreeNum
                // renderData.value.freeNumEveryDay = freeNumEveryDay
                renderData.value = res
            }
        },
        getAllSearchListInfo: async (params) => {
            const { wangwang } = params || {}
            const { data } = await getAllSearchList({
                wangwang,
                status: 0,
                pn: pageCount.value,
                ps: 10
            })
            const { ok, res } = data
            if(ok) {
                // 处理数据
                let hasUndone = false
                const list = res.reduce((result, item) => {
                    const { status } = item
                    if(status == 1) {
                        hasUndone = true
                    }
                    const statusInfo = {
                        '1': '已提交, 稍后自动重新获取数据',
                        '4': '已完成'
                    }
                    result.push({
                        ...item,
                        statusResult: statusInfo[status]
                    })
                    return result
                }, [])
                searchList.value = list
                // debugger
                // 检查是否有存在未完成的数据
                // 且页码数为 1， 则重新调用接口
                if(hasUndone && pageCount.value === 1) {
                    // debugger
                    setTimeout(() => {
                        // debugger
                        network().getAllSearchListInfo()
                    }, 10000)
                }
            }
        },
        getQuickSearchInfo: async () => {
            const { data } = await getQuickSearch({
                wangwang: search.value,
                isCanUsePoint: false
            })
            const { res, ok, count } = data
            if(ok) {
                renderData.value.todayLeftFreeNum = count
                const { resMap } = res || {}
                const target = resMap[search.value]
                searchDetail.value = {
                    wangwang: search.value,
                    ...target
                }
                showDialog.value = true
            }
        },
        getDetailInfoData: async (id) => {
            const { data } = await getDetailInfo({
                infoid: id
            })
            detailInfo.value = data
            // 这里要请求数据
            network().getDetailSearchInfoData(data.wangwang)
        },
        getDetailSearchInfoData: async (wangwang) => {
            const { data } = await getDetailSearchInfo({
                wangwang
            })
            searchDetail.value = {
                ...data,
                wangwang
            }
            showDialog.value = true
        },
        getSearchDetailInfoData: async () => {
            const { data } = await getSearchDetailInfo({
                wangwang: search.value,
                isCanUsePoint: false
            })
            const { ok, count } = data
            if(ok) {
                renderData.value.todayLeftFreeNum = count
                network().getAllSearchListInfo()
            }
        }
    }
}


// 清除 cookie
const cleanAllCookie = () => {
    document.cookie = "_sid_=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "PLAY_ERRORS=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "PLAY_FLASH=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "_bak_sid_=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "PLAY_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}


</script>

<template>
    <section class="page-container">
        <div class="num-container">
            <div class="total">
                会员每天能查<span>{{ total }}</span> 次
            </div>
            <div class="free-num">
                当天剩余<span class="green">{{ freeTotal }}</span> 次
            </div>
            <span class="logout" @click="onLogout">退出</span>
        </div>

        <div class="search-container">
            <van-field v-model="search" left-icon="contact-o" placeholder="输入旺旺号" />
            <van-button @click="onQuickSearch">急速照妖</van-button>
            <van-button type="primary" @click="onDetailSearch">仔细查询</van-button>
        </div>

        <section class="data-list-container">
            <div class="info-card" v-for="(item, index) in searchList" :key="index">
                <div class="name">
                    旺旺名: {{ item.wangwang }}
                </div>
                <ul>
                    <li>
                        状态： 
                        <span :class="[item.status == 4? 'success': '']">
                            {{ item.statusResult }}
                        </span>
                    </li>
                </ul>
                <span v-if="item.status == 4" 
                    class="detail" 
                    @click="onDetail(item.id)">查看详情</span>
            </div>
        </section>



        <van-dialog 
            v-model:show="showDialog"
            :title="detailInfo? '照妖详情': '急速照妖'"
            :showConfirmButton="false"
            :close-on-click-overlay="true"
            @closed="handlerCloseDialog">
            <div class="detail-dialog">
                <div class="name">
                    旺旺号： {{ searchDetail.wangwang }}
                </div>
                <div v-if="detailInfo" class="info-container">
                    <ul>
                        <li>
                            <span>买家信用：</span>
                            <span>
                                {{ detailInfo.buyerScore }} 
                                （好评 {{ detailInfo.buyerGoodNum }}）
                            </span>
                        </li>
                        <li>
                            <span>周均信誉点数：</span>
                            <span>{{ detailInfo.weekCreditAverage }}</span>
                        </li>
                        
                        <li>
                            <span>是否实名：</span>
                            <span>{{ detailInfo.realName }}</span>
                        </li>
                        <li>
                            <span>注册时间：</span>
                            <span>
                                {{ detailInfo.wwcreatedStr }}
                            </span>
                        </li>
                        <li>
                            <span>查询时间：</span>
                            <span>{{ detailInfo.finishTsStr }}</span>
                        </li>
                    </ul>
                </div>
                <ul class="search-info">
                    <li v-for="(item, index) in searchDetailInfo" :key="index">
                        <span class="label">{{ item.label }}</span>
                        <span 
                            class="value" 
                            :class="{ danger: item.value }">{{ item.value }}</span>
                    </li>
                </ul>
                <!-- <div v-else class="tips">暂无异常</div> -->

            </div>
        </van-dialog>

        <footer>
            <span @click="handlerRouterSujiao">去计算器页面</span>
        </footer>

    </section>
</template>

<style lang="scss" scoped>
.page-container {
    // background: #eff2f5;
    .num-container {
        position: relative;
        margin-top: 50px;
        text-align: center;
        .total, .free-num {
            height: 25px;
            line-height: 25px;
            span {
                display: inline-block;
                padding: 0 3px;
                font-size: 18px;
                font-weight: bold;
                &.green {
                    color: green;
                }
            }
        }
        .logout {
            position: absolute;
            top: 0px;
            right: 15px;
            font-size: 12px;
            color: $primary;
            cursor: pointer;
        }
    }
    .search-container {
        display: flex;
        margin: 30px 30px;
        .van-button {
            margin-left: 20px;
        }
        .van-field {
            ::v-deep .van-field__left-icon {
                margin-right: 8px;
            }
        }
    }
    .data-list-container {
        margin: 20px 30px;
        .info-card {
            position: relative;
            margin-bottom: 20px;
            padding: 20px;
            background: white;
            border-radius: 20px;
            box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
            .name {
                font-size: 16px;
                font-weight: bold;
                height: 30px;
                line-height: 30px;
            }
            ul {
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .detail {
                position: absolute;
                bottom: 30px;
                right: 30px;
                font-size: 14px;
                color: $primary;
                cursor: pointer;
            }
        }
    }


    // dialog
    .detail-dialog {
        padding: 20px;
        .name {
            font-size: 16px;
            font-weight: bold;
            height: 30px;
            line-height: 30px;
        }
        .info-container {
            margin-top: 15px;
            ul {
                li {
                    display: flex;
                    // height: 30px;
                    // line-height: 30px;
                    font-size: 14px;
                    line-height: 25px;
                    span {
                        flex: 1;
                    }
                }
            }
        }
        ul.search-info {
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px dashed #666;
            li {
                display: flex;
                width: 50%;
                height: 25px;
                line-height: 25px;
                font-size: 14px;
                span {
                    flex: 1;
                    &:nth-child(2n) {
                        text-align: center;
                    }
                }
            }
        }
        .tips {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
        }
    }

    footer {
        margin: 30px 0 50px;
        text-align: center;
        span {
            font-size: 14px;
            color: $primary;
            text-decoration: underline;
        }
    }
}
</style>