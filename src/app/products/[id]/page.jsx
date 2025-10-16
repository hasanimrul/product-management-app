"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  removeProduct,
  selectIsAuthenticated,
} from "@/lib/redux/slices/productsSlice";
import { productsAPI } from "@/lib/api/products";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productsAPI.getById(params.id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && params.id) {
      fetchProduct();
    }
  }, [params.id, isAuthenticated]);

  const handleDelete = async () => {
    try {
      await productsAPI.delete(params.id);
      dispatch(removeProduct(params.id));

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      router.push("/products");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete product",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    router.push(`/products/edit/${params.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ErrorMessage
          error={error || "Product not found"}
          onRetry={() => router.back()}
        />
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-sage hover:text-sage/80 hover:bg-sage/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-sage/20">
            <div className="aspect-square bg-muted relative">
              {!imageError ? (
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
          </Card>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setImageError(false);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-sage"
                      : "border-transparent hover:border-sage/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-dark mb-2">
                  {product.name}
                </h1>
                <Badge className="bg-sage text-light">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.category?.name || "Uncategorized"}
                </Badge>
              </div>
            </div>
            <p className="text-5xl font-bold text-gold mb-6">
              ${product.price?.toFixed(2) || "0.00"}
            </p>
          </div>

          <Card className="border-sage/20">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-dark mb-3">
                Description
              </h2>
              <p className="text-dark/80 leading-relaxed whitespace-pre-wrap">
                {product.description || "No description available"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardContent className="pt-6 space-y-3">
              <h2 className="text-lg font-semibold text-dark mb-3">
                Product Information
              </h2>

              <div className="flex items-center text-dark/70">
                <Calendar className="h-4 w-4 mr-2 text-sage" />
                <span className="text-sm">
                  <strong>Created:</strong> {formatDate(product.createdAt)}
                </span>
              </div>

              <div className="flex items-center text-dark/70">
                <Calendar className="h-4 w-4 mr-2 text-sage" />
                <span className="text-sm">
                  <strong>Last Updated:</strong> {formatDate(product.updatedAt)}
                </span>
              </div>

              {product.slug && (
                <div className="text-dark/70">
                  <span className="text-sm">
                    <strong>Slug:</strong> {product.slug}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleEdit}
              className="flex-1 bg-gold hover:bg-gold/90 text-dark font-semibold"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="flex-1 border-rust text-rust hover:bg-rust hover:text-light font-semibold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        productName={product.name}
      />
    </div>
  );
}
