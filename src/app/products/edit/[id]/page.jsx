"use client";

import ProductForm from "@/components/ProductForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import useProductEdit from "@/hooks/use-product-edit";

export default function EditProductPage() {
  const { product, isLoading, error, isSubmitting, handleSubmit, router } =
    useProductEdit();

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
          className="mb-4 text-sage hover:text-sage/80 hover:bg-sage/10 cursor-pointer"
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
