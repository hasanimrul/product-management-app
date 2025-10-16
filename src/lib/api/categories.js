import axiosInstance from "./axios";

export const categoriesAPI = {
  getAll: async (offset = 0, limit = 100) => {
    const response = await axiosInstance.get(
      `/categories?offset=${offset}&limit=${limit}`
    );
    return response.data;
  },
};
