
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateReview } from "@/services/review-service"
import { toast } from "sonner"

interface ReviewUpdateModalProps {
    review: {
        id: number
        rating: number
        content: string
    }
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onReviewUpdated: () => void
}

const ReviewUpdateModal = ({ review, isOpen, onOpenChange, onReviewUpdated }: ReviewUpdateModalProps) => {
    const [rating, setRating] = useState(review.rating)
    const [content, setContent] = useState(review.content)
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdate = async () => {
        try {
            setIsLoading(true)
            await updateReview(review.id, { rating, content })
            onReviewUpdated()
            onOpenChange(false)
            toast.success("Đánh giá đã được cập nhật thành công")
        } catch (error) {
            console.error('Error updating review:', error)
            toast.error("Đánh giá cập nhật thất bại")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log(review)
        setRating(review.rating)
        setContent(review.content)
    }, [review])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="rating">Đánh giá</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-2 rounded hover:bg-muted transition-colors ${
                                        rating >= star ? 'text-yellow-400' : 'text-gray-400'
                                    }`}
                                >
                                    <svg
                                  className={`h-4 w-4 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Nội dung</Label>
                        <Input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full"
                            placeholder="Nhập nội dung đánh giá..."
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
 
export default ReviewUpdateModal;