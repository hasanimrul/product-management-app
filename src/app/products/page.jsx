"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setProducts,
  setCategories,
  setLoading,
  setError,
  removeProduct,
  setPagination,
  selectProducts,
  selectLoading,
  selectError,
  selectPagination,
  selectIsAuthenticated,
} from "@/lib/redux/slices/productsSlice";
import { productsAPI } from "@/lib/api/products";
import { categoriesAPI } from "@/lib/api/categories";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pagination = useSelector(selectPagination);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const persistedState = localStorage.getItem("redux_state");
        if (
          !persistedState ||
          !JSON.parse(persistedState).auth?.isAuthenticated
        ) {
          router.replace("/auth");
        }
      }
    }
  }, [isAuthenticated, router]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        dispatch(setCategories(data));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [dispatch]);

  // Fetch products
  const fetchProducts = useCallback(
    async (offset = 0) => {
      dispatch(setLoading(true));
      try {
        const data = await productsAPI.getAll(offset, pagination.limit);
        dispatch(setProducts(data));
        dispatch(setPagination({ offset, total: data.length }));
      } catch (err) {
        dispatch(setError(err.message));
      }
    },
    [dispatch, pagination.limit]
  );

  // Search products
  const searchProducts = useCallback(
    async (query) => {
      if (!query.trim()) {
        fetchProducts(0);
        return;
      }

      setIsSearching(true);
      dispatch(setLoading(true));
      try {
        const data = await productsAPI.search(query);
        dispatch(setProducts(data));
        dispatch(setPagination({ offset: 0, total: data.length }));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch, fetchProducts]
  );

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts(0);
    }
  }, [isAuthenticated]);

  // Handle search
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      searchProducts(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleDelete = async (productId) => {
    try {
      await productsAPI.delete(productId);
      dispatch(removeProduct(productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    dispatch(setPagination({ offset: newOffset }));
    fetchProducts(newOffset);
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    dispatch(setPagination({ offset: newOffset }));
    fetchProducts(newOffset);
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const hasNextPage = products.length === pagination.limit;
  const hasPrevPage = pagination.offset > 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">Products</h1>
            <p className="text-dark/70">Manage your product inventory</p>
          </div>
          <Button
            onClick={() => router.push("/products/create")}
            className="bg-sage hover:bg-sage/90 text-light"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4 border-sage/20">
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

      {/* Loading State */}
      {loading && !isSearching && <LoadingSpinner />}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {!searchQuery && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                className="border-sage/30 text-sage hover:bg-sage hover:text-light disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-dark font-medium">Page {currentPage}</span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className="border-sage/30 text-sage hover:bg-sage hover:text-light disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}

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
              className="bg-sage hover:bg-sage/90 text-light"
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
