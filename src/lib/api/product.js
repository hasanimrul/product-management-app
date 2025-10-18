import axiosInstance from "./axios";

export const productsAPI = {
  getAll: async (offset = 0, limit = 10) => {
    const response = await axiosInstance.get(
      `/products?offset=${offset}&limit=${limit}&t=${Date.now()}`,
      {
        cache: "no-store",
      }
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await axiosInstance.get(
      `/products?categoryId=${categoryId}`
    );
    return response.data;
  },

  search: async (searchedText) => {
    const response = await axiosInstance.get(
      `/products/search?searchedText=${encodeURIComponent(searchedText)}`
    );
    return response.data;
  },

  create: async (productData) => {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};
