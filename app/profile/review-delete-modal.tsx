import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteReview } from "@/services/review-service"
import { toast } from "sonner"

interface ReviewDeleteModalProps {
    reviewId: number
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onReviewDeleted: () => void
}

const ReviewDeleteModal = ({ reviewId, isOpen, onOpenChange, onReviewDeleted }: ReviewDeleteModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            await deleteReview(reviewId)
            toast.success("Đánh giá đã được xóa thành công")
            onReviewDeleted()
            onOpenChange(false)
        } catch (error) {
            console.error('Error deleting review:', error)
            toast.error("Không thể xóa đánh giá")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xóa đánh giá</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-muted-foreground">Bạn có chắc chắn muốn xóa đánh giá này không?</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            "Đang xóa..."
                        ) : (
                            "Xóa"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
 
export default ReviewDeleteModal;