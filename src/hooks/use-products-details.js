import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { removeProduct } from "@/lib/redux/slices/productSlice";
import { productsAPI } from "@/lib/api/product";

import { useToast } from "@/hooks/use-toast";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";

export default function useProductsDetails() {
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
  return {
    isAuthenticated,
    product,
    isLoading,
    error,
    showDeleteDialog,
    setShowDeleteDialog,
    currentImageIndex,
    setCurrentImageIndex,
    imageError,
    setImageError,
    handleDelete,
    handleEdit,
    formatDate,
    router,
  };
}
