"use client";

import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import useProductCreate from "@/hooks/use-product-create";
import { ArrowLeft } from "lucide-react";

export default function CreateProductPage() {
  const { handleSubmit, isSubmitting, router } = useProductCreate();
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
        <h1 className="text-3xl font-bold text-dark">Create New Product</h1>
        <p className="text-dark/70 mt-2">Add a new product to your inventory</p>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
