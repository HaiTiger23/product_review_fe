import axios from "axios"
import api, { BASE_URL } from "./base-service"
import { routerApi } from "./route-api"

export const addProduct = async ({
    name,
    price,
    category_id,
    description,
    images,
    spec_name,
    spec_value,
    token
}: {
    name: string
    price: string
    category_id: string | number
    description?: string
    images?: File[]
    spec_name?: string[]
    spec_value?: string[]
    token: string
}) => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("category", String(category_id))
    if (description) formData.append("description", description)
    if (images && images.length) {
        images.forEach((file) => formData.append("images[]", file))
    }
    let specification: { name: string; value: string }[] = [];
    if (spec_name && spec_value && spec_name.length === spec_value.length) {
        spec_name.forEach((name, idx) => {
            specification.push({ name, value: spec_value[idx] })
        })
    }
    formData.append("specifications", JSON.stringify(specification))
    const response = await axios
        .post(BASE_URL + '/' + routerApi.product.add, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        })
    return response.data
}

export const getAllProducts = async ({
    page = 1,
    limit = 10,
    category_id,
    search,
    sort = "newest",
  }: {
    page?: number
    limit?: number
    category_id?: number | string
    search?: string
    sort?: "price_asc" | "price_desc" | "newest" | "rating"
  } = {}) => {
    const params: any = { page, limit, sort }
    if (category_id) params.category_id = category_id
    if (search) params.search = search
  
    const response = await api.get(routerApi.product.getAll, { params })
    return response.data 
  }

  export const getProductById = async (id: string | number) => {
    const response = await api.get(routerApi.product.getById.replace(":id", String(id)))
    return response.data
  }