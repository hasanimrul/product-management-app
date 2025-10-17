"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  logout,
  selectCurrentEmail,
  selectIsAuthenticated,
} from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const email = useSelector(selectCurrentEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("redux_state");
    router.push("/auth");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-primary border-b border-sage/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/products")}
          >
            <Package className="h-6 w-6 text-gold" />
            <span className="text-light font-bold text-xl">
              Product Manager
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-light/80 text-sm hidden md:inline">
              {email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-light hover:text-gold hover:bg-sage/20 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
