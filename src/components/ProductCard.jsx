"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function ProductCard({ product, onDelete }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleView = () => {
    router.push(`/products/${product?.slug}`);
  };

  const handleEdit = () => {
    router.push(`/products/edit/${product?.slug}`);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(product?.id);
    setShowDeleteDialog(false);
  };

  const imageUrl =
    product?.images?.[0] ||
    "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-sage/20 overflow-hidden bg-white">
        <div
          className="relative h-48 bg-muted overflow-hidden cursor-pointer"
          onClick={handleView}
        >
          {!imageError ? (
            <img
              src={imageUrl}
              alt={product?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-sage text-light">
              {product?.category?.name || "Uncategorized"}
            </Badge>
          </div>
        </div>

        <CardContent className="pt-4">
          <h3
            className="font-semibold text-lg mb-2 text-dark line-clamp-1 cursor-pointer hover:text-sage transition-colors"
            onClick={handleView}
          >
            {product?.name}
          </h3>
          <p className="text-sm text-dark/70 line-clamp-2 mb-3 min-h-[40px]">
            {product?.description || "No description available"}
          </p>
          <p className="text-2xl font-bold text-gold">
            ${product?.price?.toFixed(2) || "0.00"}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="flex-1 gap-0 text-xs border-sage/30 text-sage hover:bg-sage hover:text-light cursor-pointer "
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex-1 gap-0 text-xs border-gold/30 text-gold hover:bg-gold hover:text-dark cursor-pointer"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 gap-0 text-xs border-rust/30 text-rust hover:bg-rust hover:text-light cursor-pointer"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        productName={product?.name}
      />
    </>
  );
}
