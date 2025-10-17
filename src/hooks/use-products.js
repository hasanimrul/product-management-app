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
} from "@/lib/redux/slices/productSlice";
import { productsAPI } from "@/lib/api/product";
import { categoriesAPI } from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";

export default function useProducts() {
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
      const persistedState = localStorage.getItem("redux_state");
      if (
        !persistedState ||
        !JSON.parse(persistedState).auth?.isAuthenticated
      ) {
        router.replace("/auth");
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

  return {
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
  };
}
