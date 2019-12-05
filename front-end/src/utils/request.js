import axios from 'axios'

const HOST = `${process.env.API_HOST}:${process.env.API_PORT}`
var axiosInstance = axios.create({
  baseURL: HOST,
})

export default axiosInstance
