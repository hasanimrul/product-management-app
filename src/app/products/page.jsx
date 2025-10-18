"use client";

import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import useProducts from "@/hooks/use-products";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isSearching,
    handleDelete,
    handleNextPage,
    handlePrevPage,
    currentPage,
    hasNextPage,
    hasPrevPage,
    isAuthenticated,
    router,
    fetchProducts,
    pagination,
    categories,
    handleCategoryClick,
  } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");
  if (isAuthenticated === undefined) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated === false) {
    router.replace("/auth");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 w-full">
        <div className="flex flex-col items-center justify- mb-6">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">
            Showing {selectedCategory} Products
          </h1>
          <p className="text-dark/70">Manage your product inventory</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-6 w-full">
          {/* Search Bar */}
          <Card className="p-2 border-sage/20 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark/40" />
              <Input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </Card>
          <Button
            onClick={() => router.push("/products/create")}
            className="bg-sage hover:bg-sage/90 text-light cursor-pointer !h-13"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage
            error={error}
            onRetry={() => fetchProducts(pagination.offset)}
          />
        </div>
      )}

      {/* Products  */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        <div className=" col-span-1 border border-sage/20 rounded-lg p-4 max-h-max flex flex-col gap-4">
          <h2 className="text-lg">Categories</h2>
          <RadioGroup defaultValue="All">
            <div className="flex items-center gap-2 ">
              <RadioGroupItem
                value="All"
                id="All"
                className="cursor-pointer"
                onClick={() => {
                  handleCategoryClick("");
                  setSelectedCategory("All");
                }}
              />
              <Label className="cursor-pointer" htmlFor="All">
                All
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category?.id} className="flex items-center gap-2 ">
                <RadioGroupItem
                  id={category?.id}
                  value={category.name}
                  onClick={() => {
                    handleCategoryClick(category?.id);
                    setSelectedCategory(category.name);
                  }}
                  className="cursor-pointer"
                />
                <Label htmlFor={category?.id} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {!loading && !isSearching && products.length > 0 ? (
          <div className="col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product?.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && hasNextPage && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                  className="border-sage/30 text-sage hover:bg-sage hover:text-light disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-dark font-medium">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className="border-sage/30 text-sage hover:bg-sage hover:text-light disabled:opacity-50 cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-3">
            <LoadingSpinner text="Loading products.." />
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-dark/40" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">
            {searchQuery ? "No products found" : "No products yet"}
          </h3>
          <p className="text-dark/70 mb-6">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by creating your first product"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => router.push("/products/create")}
              className="bg-sage hover:bg-sage/90 text-light cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
