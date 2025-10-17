import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setCredentials,
  selectIsAuthenticated,
} from "@/lib/redux/slices/authSlice";
import { authAPI } from "@/lib/api/auth";
export default function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI?.login(email);

      // Store token and email in Redux
      dispatch(
        setCredentials({
          token: response?.token || response?.access_token,
          email: email,
        })
      );

      // Persist to localStorage
      const state = {
        auth: {
          token: response.token || response.access_token,
          email: email,
          isAuthenticated: true,
        },
      };
      localStorage.setItem("redux_state", JSON.stringify(state));

      router.push("/products");
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    email,
    setEmail,
    error,
    isLoading,
    handleSubmit,
  };
}
