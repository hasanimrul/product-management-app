"use client";

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
import ProductForm from "@/components/ProductForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";

export default function EditProductPage() {
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

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <ErrorMessage error={error} onRetry={() => router.back()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-sage hover:text-sage/80 hover:bg-sage/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-dark">Edit Product</h1>
        <p className="text-dark/70 mt-2">Update product information</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
