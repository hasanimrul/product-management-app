import axiosInstance from "./axios";

export const authAPI = {
  login: async (email) => {
    const response = await axiosInstance.post("/auth", { email });
    return response.data;
  },
};
