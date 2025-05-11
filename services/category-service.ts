import api from "./base-service"
import { routerApi } from "./route-api"

// Lấy danh sách tất cả danh mục
export const getAllCategories = async () => {
  const response = await api.get(routerApi.category.getAll)
  return response.data // { categories: [...] }
}

// Lấy chi tiết 1 danh mục theo id
export const getCategoryById = async (id: number | string) => {
  const response = await api.get(routerApi.category.getById.replace(":id", id.toString()))
  return response.data // { category: {...} }
}

// Thêm danh mục mới (Chỉ Admin)
export const createCategory = async (data: { name: string; parent_id?: number | null }) => {
  const response = await api.post(routerApi.category.create, data)
  return response.data
}

// Cập nhật danh mục (Chỉ Admin)
export const updateCategory = async (
  id: number | string,
  data: { name: string; parent_id?: number | null }
) => {
  const response = await api.put(routerApi.category.update.replace(":id", id.toString()), data)
  return response.data
}

// Xoá danh mục (Chỉ Admin)
export const deleteCategory = async (id: number | string) => {
  const response = await api.delete(routerApi.category.delete.replace(":id", id.toString()))
  return response.data
}