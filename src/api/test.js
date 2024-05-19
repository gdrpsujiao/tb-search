import { axios } from '@/util/axios'

export const getTest = () => {
    return axios({
        method: 'get',
        url: '/promotion/top'
    })
}