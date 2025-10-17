import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addProduct, setCategories } from "@/lib/redux/slices/productSlice";
import { productsAPI } from "@/lib/api/product";
import { categoriesAPI } from "@/lib/api/categories";

import { useToast } from "@/hooks/use-toast";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";

export default function useProductCreate() {
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
  return {
    handleSubmit,
    isSubmitting,
    router,
  };
}
