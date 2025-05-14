"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { addReview } from "@/services/review-service"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"


interface ReviewFormProps {
  productId: string
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hover, setHover] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [userReview, setUserReview] = useState<any>(null)
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá")
      return
    }

    setIsSubmitting(true)

    try {
      // Gọi API thêm đánh giá
      const result = await addReview(productId, {
        rating,
        content: comment,
      })
      // Reset form sau khi gửi thành công
      setRating(0)
      setComment("")
      setUserReview(result.data)
      toast.success("Đánh giá của bạn đã được gửi thành công!")
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] })
      queryClient.invalidateQueries({ queryKey: ["product", productId] })
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error)
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="rating">Đánh giá của bạn</Label>
        {userReview && (
          <div className="flex items-center gap-1">
            <Star
              className={`h-8 w-8 fill-yellow-400 text-yellow-400`}
            />
            <span className="ml-2 text-sm text-muted-foreground">{userReview.rating} sao</span>
          </div>
        )}
        {!userReview && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
                <span className="sr-only">{star} sao</span>
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating} sao` : "Chưa đánh giá"}</span>
          </div>
        )}
      </div>
      {userReview && (
        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">Bạn đã đánh giá sản phẩm này</p>
          <p>{userReview.content}</p>
        </div>
      )}
      {!userReview && (
        <>
          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét của bạn</Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </  Button>
        </>
      )}
    </form>
  )
}
