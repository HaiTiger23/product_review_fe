"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addProduct } from "@/lib/api"

// Danh mục sản phẩm mẫu
const categories = [
  { value: "dien-thoai", label: "Điện thoại" },
  { value: "may-tinh-bang", label: "Máy tính bảng" },
  { value: "laptop", label: "Laptop" },
  { value: "may-tinh-de-ban", label: "Máy tính để bàn" },
  { value: "may-anh", label: "Máy ảnh" },
  { value: "am-thanh", label: "Âm thanh" },
  { value: "tv", label: "TV" },
  { value: "thiet-bi-thong-minh", label: "Thiết bị thông minh" },
  { value: "tu-lanh", label: "Tủ lạnh" },
  { value: "may-giat", label: "Máy giặt" },
  { value: "dieu-hoa", label: "Điều hòa" },
  { value: "gia-dung-khac", label: "Gia dụng khác" },
]

interface Specification {
  id: string
  name: string
  value: string
}

interface ProductImage {
  id: string
  file: File | null
  preview: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("thong-tin")
  const [showPreview, setShowPreview] = useState(false)

  // Thông tin sản phẩm
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [specifications, setSpecifications] = useState<Specification[]>([{ id: "1", name: "", value: "" }])
  const [images, setImages] = useState<ProductImage[]>([
    { id: "1", file: null, preview: "/placeholder.svg?height=200&width=200" },
  ])

  // Thông báo lỗi
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Thêm thông số kỹ thuật mới
  const addSpecification = () => {
    setSpecifications([...specifications, { id: Date.now().toString(), name: "", value: "" }])
  }

  // Xóa thông số kỹ thuật
  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter((spec) => spec.id !== id))
  }

  // Cập nhật thông số kỹ thuật
  const updateSpecification = (id: string, field: "name" | "value", value: string) => {
    setSpecifications(specifications.map((spec) => (spec.id === id ? { ...spec, [field]: value } : spec)))
  }

  // Thêm hình ảnh mới
  const addImage = () => {
    if (images.length < 5) {
      setImages([
        ...images,
        { id: Date.now().toString(), file: null, preview: "/placeholder.svg?height=200&width=200" },
      ])
    }
  }

  // Xóa hình ảnh
  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  // Xử lý khi chọn file hình ảnh
  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        setImages(
          images.map((img) =>
            img.id === id
              ? {
                  ...img,
                  file: file,
                  preview: event.target?.result as string,
                }
              : img,
          ),
        )
      }

      reader.readAsDataURL(file)
    }
  }

  // Kiểm tra form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!productName.trim()) newErrors.productName = "Vui lòng nhập tên sản phẩm"
    if (!category) newErrors.category = "Vui lòng chọn danh mục sản phẩm"
    if (!price.trim()) newErrors.price = "Vui lòng nhập giá sản phẩm"
    if (!description.trim()) newErrors.description = "Vui lòng nhập mô tả sản phẩm"

    // Kiểm tra thông số kỹ thuật
    const hasEmptySpec = specifications.some((spec) => !spec.name.trim() || !spec.value.trim())
    if (hasEmptySpec) newErrors.specifications = "Vui lòng điền đầy đủ thông số kỹ thuật hoặc xóa bỏ dòng trống"

    // Kiểm tra hình ảnh
    const hasNoImage = images.every((img) => img.file === null)
    if (hasNoImage) newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý khi gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Chuyển đến tab có lỗi
      if (errors.productName || errors.category || errors.price || errors.description) {
        setActiveTab("thong-tin")
      } else if (errors.specifications) {
        setActiveTab("thong-so")
      } else if (errors.images) {
        setActiveTab("hinh-anh")
      }
      return
    }

    setIsSubmitting(true)

    // Tạo đối tượng FormData để gửi dữ liệu và file
    const formData = new FormData()
    formData.append("name", productName)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("description", description)
    formData.append("specifications", JSON.stringify(specifications))

    // Thêm các file hình ảnh
    images.forEach((img, index) => {
      if (img.file) {
        formData.append(`image_${index}`, img.file)
      }
    })

    try {
      // Gọi API thêm sản phẩm
      const result = await addProduct(formData)

      // Chuyển hướng sau khi thành công
      router.push("/products")
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm mới</h1>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="thong-tin">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="thong-so">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="hinh-anh">Hình ảnh</TabsTrigger>
            </TabsList>

            {/* Tab thông tin cơ bản */}
            <TabsContent value="thong-tin" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Nhập các thông tin cơ bản về sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="product-name"
                      placeholder="Nhập tên sản phẩm"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={errors.productName ? "border-red-500" : ""}
                    />
                    {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Chọn danh mục sản phẩm" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Giá sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      placeholder="Ví dụ: 1.990.000 ₫"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Mô tả sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả chi tiết về sản phẩm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Hủy
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("thong-so")}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab thông số kỹ thuật */}
            <TabsContent value="thong-so" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật</CardTitle>
                  <CardDescription>Thêm các thông số kỹ thuật của sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {errors.specifications && (
                    <Alert variant="destructive">
                      <Info className="h-4 w-4" />
                      <AlertDescription>{errors.specifications}</AlertDescription>
                    </Alert>
                  )}

                  {specifications.map((spec, index) => (
                    <div key={spec.id} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`spec-name-${spec.id}`}>Tên thông số</Label>
                        <Input
                          id={`spec-name-${spec.id}`}
                          placeholder="Ví dụ: Màn hình, CPU, RAM..."
                          value={spec.name}
                          onChange={(e) => updateSpecification(spec.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`spec-value-${spec.id}`}>Giá trị</Label>
                        <Input
                          id={`spec-value-${spec.id}`}
                          placeholder="Ví dụ: 6.8 inch, Snapdragon 8 Gen 2, 12GB..."
                          value={spec.value}
                          onChange={(e) => updateSpecification(spec.id, "value", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeSpecification(spec.id)}
                        disabled={specifications.length === 1}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Xóa thông số</span>
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addSpecification}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thông số
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("thong-tin")}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("hinh-anh")}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab hình ảnh */}
            <TabsContent value="hinh-anh" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  <CardDescription>Tải lên hình ảnh sản phẩm (tối đa 5 hình ảnh)</CardDescription>
                </CardHeader>
                <CardContent>
                  {errors.images && (
                    <Alert variant="destructive" className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>{errors.images}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="border rounded-md p-4 relative">
                        <div className="aspect-square relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt="Hình ảnh sản phẩm"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1">
                            <Button variant="outline" className="w-full" type="button" asChild>
                              <div>
                                <Upload className="mr-2 h-4 w-4" />
                                {img.file ? "Thay đổi" : "Tải lên"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageChange(img.id, e)}
                                />
                              </div>
                            </Button>
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(img.id)}
                            disabled={images.length === 1}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Xóa hình ảnh</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {images.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-full min-h-[200px] flex flex-col items-center justify-center border-dashed"
                        onClick={addImage}
                      >
                        <Plus className="h-6 w-6 mb-2" />
                        <span>Thêm hình ảnh</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-4 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setActiveTab("thong-so")}
                      className="flex-1 sm:flex-none"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex-1 sm:flex-none"
                    >
                      {showPreview ? "Ẩn xem trước" : "Xem trước"}
                    </Button>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Đang xử lý..." : "Thêm sản phẩm"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Xem trước sản phẩm */}
              {showPreview && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Xem trước sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                          <img
                            src={images[0]?.preview || "/placeholder.svg?height=400&width=400"}
                            alt="Hình ảnh sản phẩm"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {images.map((img, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={img.preview || "/placeholder.svg"}
                                alt={`Hình ảnh ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <Badge>{categories.find((cat) => cat.value === category)?.label || "Danh mục"}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{productName || "Tên sản phẩm"}</h2>
                        <p className="text-xl font-semibold text-primary mb-4">{price || "Giá sản phẩm"}</p>
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Mô tả:</h3>
                          <p className="text-muted-foreground">{description || "Mô tả sản phẩm"}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Thông số kỹ thuật:</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {specifications.map((spec, index) =>
                              spec.name && spec.value ? (
                                <li key={index}>
                                  {spec.name}: {spec.value}
                                </li>
                              ) : null,
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
