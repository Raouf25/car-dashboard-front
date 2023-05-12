import store from '@/store'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios' 
// grace au riverse proxi de vue.config.js
//const BASE_URL = 'http://localhost:8080/'  //=> http://localhost:8080/cars?sort=createDate
//const BASE_URL = 'https://spring-boot-efficient-search-api.fly.dev/api'  // => https://spring-boot-efficient-search-api.fly.dev/api/cars?sort=createDate
const BASE_URL = process.env.VUE_APP_PROXY

class AxiosService {
  private instance: AxiosInstance;

  constructor (baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Authorization': 'Bearer I-g0XhI0YY8lz3JTrrY5sOh2slyOq7WMGK4ZoUrMXic',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }) 
    this.instance.interceptors.request.use((request) => {
      store.dispatch('globalValues/setLoading', true)
      return request
    })
  
    this.instance.interceptors.response.use(
      (response) => {
        store.dispatch('globalValues/setLoading', false)
        return response
      },
      (error) => {
        store.dispatch('globalValues/setLoading', false)
        return error
      }
    )

  }

  get<T> (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url,config)
  }

  post<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config)
  }

  postFiles<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data'
    };
    return this.instance.post<T>(url, formData, { ...config, headers });
  }

  put<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config)
  }

  patch<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config)
  }

  delete<T> (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config)
  }
}

const axiosService = new AxiosService(BASE_URL)
export default axiosService