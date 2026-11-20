import axios from "axios"
import type { CreateProductPayload, ProductDTO } from "../types/shop.types"

/**
 * Сконфігурований інстанс Axios для магазину (FakeStoreAPI).
 * Використовується у Live-кодингу №2 (ShopAxiosLive.tsx) для порівняння з Fetch API.
 */
export const shopAxiosClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Перехоплювач запитів (Request Interceptor): автоматичне логування та токен
shopAxiosClient.interceptors.request.use(
  (config) => {
    const token = "demo-shop-token-pv511"
    config.headers.Authorization = `Bearer ${token}`
    console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error),
)

// Перехоплювач відповідей (Response Interceptor): централізована обробка помилок
shopAxiosClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] ${response.status} ${response.config.url}`)
    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("[Axios Error]", error.response?.status, error.message)
    }
    return Promise.reject(error)
  },
)

export const getShopProducts = async (limit = 6): Promise<ProductDTO[]> => {
  const response = await shopAxiosClient.get<ProductDTO[]>("/products", {
    params: { limit },
  })
  return response.data
}

export const getShopProductById = async (
  id: number,
  signal?: AbortSignal,
): Promise<ProductDTO> => {
  const response = await shopAxiosClient.get<ProductDTO>(`/products/${id}`, {
    signal,
  })
  return response.data
}

export const createShopProduct = async (
  payload: CreateProductPayload,
): Promise<ProductDTO> => {
  const response = await shopAxiosClient.post<ProductDTO>("/products", payload)
  return response.data
}

export const deleteShopProduct = async (id: number): Promise<ProductDTO> => {
  const response = await shopAxiosClient.delete<ProductDTO>(`/products/${id}`)
  return response.data
}
