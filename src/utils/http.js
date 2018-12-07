import axios from 'axios'
// import {
//     Loading,
//     Message
// } from 'element-ui'
 
const http = axios.create({
    // 请求超时时间
    timeout: 10000,
    baseURL: '域名'
})

http.interceptors.request.use(
    config => {
        return config;
    })

http.interceptors.response.use(
    function (response) {
        return Promise.resolve(response)
    },
    function (error) {
        return Promise.reject(error)
    })

export default http;