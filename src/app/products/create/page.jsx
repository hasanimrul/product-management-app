"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addProduct,
  setCategories,
  selectIsAuthenticated,
} from "@/lib/redux/slices/productsSlice";
import { productsAPI } from "@/lib/api/products";
import { categoriesAPI } from "@/lib/api/categories";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        dispatch(setCategories(data));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [dispatch, isAuthenticated, toast]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newProduct = await productsAPI.create(formData);
      dispatch(addProduct(newProduct));

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      router.push("/products");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
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
        <h1 className="text-3xl font-bold text-dark">Create New Product</h1>
        <p className="text-dark/70 mt-2">Add a new product to your inventory</p>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
