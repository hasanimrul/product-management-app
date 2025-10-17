import { useToast } from "@/hooks/use-toast";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  updateProduct,
  setCategories,
  setLoading,
} from "@/lib/redux/slices/productSlice";

import { productsAPI } from "@/lib/api/product";
import { categoriesAPI } from "@/lib/api/categories";

export default function useProductEdit() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productData, categoriesData] = await Promise.all([
          productsAPI.getById(params.id),
          categoriesAPI.getAll(),
        ]);

        setProduct(productData);
        dispatch(setCategories(categoriesData));
      } catch (err) {
        setError(err.message || "Failed to load product");
        toast({
          title: "Error",
          description: err.message || "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && params.id) {
      fetchData();
    }
  }, [dispatch, params.id, isAuthenticated, toast]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const updatedProduct = await productsAPI.update(product?.id, formData);
      dispatch(updateProduct(updatedProduct));

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      router.push("/products");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    product,
    isLoading,
    error,
    isSubmitting,
    handleSubmit,
    router,
  };
}
