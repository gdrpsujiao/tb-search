import { axios } from '@/util/axios'

export const doLogin = data => {
    return axios({
        method: 'post',
        url: '/taobao/LoginUI/doLogin',
        data
    })
}

export const findUser = (data, headers = {}) => {
    return axios({
        method: 'post',
        url: '/taobao/application/findUser',
        data,
        headers,
        // withCredentials: true
    })
}

export const getRenderData = data => {
    return axios({
        method: 'post',
        url: '/taobao/gongjuui/getWWRateRenderBean',
        data
    })
}

export const getSearchList = params => {
    return axios({
        method: 'get',
        url: '/taobao/NetflowMission/getWxList',
        params
    })
}

export const getAllSearchList = data => {
    return axios({
        method: 'post',
        url: '/taobao/Gongjuui/getAllTXMWWRateInfo',
        data
    })
}

export const getQuickSearch = data => {
    return axios({
        method: 'post',
        url: '/taobao/GongjuUI/getWwListForBatch',
        data
    })
}

export const getDetailInfo = params => {
    return axios({
        method: 'get',
        url: '/taobao/Gongjuui/getTXMWWInfoById',
        params
    })
}

export const getDetailSearchInfo = params => {
    return axios({
        method: 'get',
        url: '/taobao/NetflowMission/getWwList',
        params
    })
}

export const getSearchDetailInfo = data => {
    return axios({
        method: 'post',
        url: '/taobao/GongjuUI/publishTXMWWRateInfo',
        data
    })
}

