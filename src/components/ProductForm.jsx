"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCategories } from "@/lib/redux/slices/productSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProductForm({
  initialData = null,
  onSubmit,
  isSubmitting,
}) {
  const categories = useSelector(selectCategories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    images: [""],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        categoryId: initialData.category?.id || "",
        images: initialData.images?.length ? initialData.images : [""],
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum)) {
        newErrors.price = "Price must be a valid number";
      } else if (priceNum <= 0) {
        newErrors.price = "Price must be greater than 0";
      } else if (priceNum > 1000000) {
        newErrors.price = "Price cannot exceed 1,000,000";
      }
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    // Image validation
    const validImages = formData.images.filter((img) => img.trim());
    if (validImages.length === 0) {
      newErrors.images = "At least one image URL is required";
    } else {
      // Validate URL format
      const urlPattern = /^https?:\/\/.+/;
      const invalidImages = validImages.filter((img) => !urlPattern.test(img));
      if (invalidImages.length > 0) {
        newErrors.images = "All image URLs must start with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: formData.images.filter((img) => img.trim()),
      };
      onSubmit(submitData);
    }
  };

  return (
    <Card className="border-sage/20">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-dark">
          {initialData ? "Edit Product" : "Create New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-dark">
              Product Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter product name"
              className={errors.name ? "border-red-600" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-dark">
              Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className={errors.description ? "border-red-600" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-dark">
              Price ($) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
              className={errors.price ? "border-red-600" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-dark">
              Category <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleChange("categoryId", value)}
            >
              <SelectTrigger
                className={errors.categoryId ? "border-red-600" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-dark">
              Image URLs <span className="text-red-600">*</span>
            </Label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={errors.images ? "border-red-600" : ""}
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeImageField(index)}
                    className="border-red-600/30 text-red-600 hover:bg-red-600 hover:text-light"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageField}
              className="w-full border-sage/30 text-sage hover:bg-sage hover:text-light"
            >
              Add Another Image
            </Button>
            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-sage hover:bg-sage/90 text-light"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{initialData ? "Update Product" : "Create Product"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
