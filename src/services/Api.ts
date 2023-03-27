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

    this.instance.interceptors.request.use(
      (config) => {
        config.url = config.url?.split('|').join('%7C')
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  get<T> (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url,config)
  }

  post<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config)
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