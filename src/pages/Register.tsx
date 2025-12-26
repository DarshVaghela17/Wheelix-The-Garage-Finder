import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noSpaces: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    garageName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check password requirements
  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noSpaces: !/\s/.test(password),
    };
  };

  // Validate password strength
  const validatePassword = (password: string): boolean => {
    const requirements = checkPasswordRequirements(password);
    return Object.values(requirements).every((req) => req === true);
  };

  // Calculate password strength
  const getPasswordStrength = (): string => {
    const requirements = Object.values(passwordRequirements).filter(
      (req) => req === true
    ).length;
    if (requirements <= 2) return "Weak";
    if (requirements <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = (): string => {
    const strength = getPasswordStrength();
    if (strength === "Weak") return "text-red-600";
    if (strength === "Medium") return "text-yellow-600";
    return "text-green-600";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Real-time password validation
    if (name === "password") {
      setPasswordRequirements(checkPasswordRequirements(value));
    }

    // Real-time confirm password validation
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      if (name === "password" && value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: "Passwords do not match",
        });
      } else if (name === "confirmPassword" && value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: "Passwords do not match",
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: "",
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password does not meet all requirements";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate garage name if role is garager
    if (formData.role === "garager" && !formData.garageName.trim()) {
      newErrors.garageName = "Garage name is required for garager role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all form errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.role === "garager" && {
          garageName: formData.garageName.trim(),
        }),
      });

      if (response.data.success) {
        // ✅ FIXED: Store token with correct key "token" instead of "authToken"
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userName", response.data.user.firstName);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success("Account created successfully! Welcome to Wheelix!");

        // ✅ FIXED: Redirect based on role with correct role names
        setTimeout(() => {
          if (formData.role === "user") {
            navigate("/user/dashboard");
          } else if (formData.role === "garager") {  // Fixed: was "garage"
            navigate("/garager/dashboard");
          } else if (formData.role === "admin") {
            navigate("/admin/dashboard");
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        const errorMessage = error.response.data?.message || "Registration failed";
        toast.error(errorMessage);
        if (error.response.status === 400 && errorMessage.includes("Email")) {
          setErrors({
            email: errorMessage,
          });
        }
      } else if (error.request) {
        toast.error("Unable to connect to server. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join Wheelix to find trusted garages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <p className={`text-sm font-medium ${getStrengthColor()}`}>
                  Password Strength: {getPasswordStrength()}
                </p>
              )}

              {/* Password Requirements Checklist */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Password must contain:
                  </p>
                  {Object.entries({
                    minLength: "At least 8 characters",
                    hasUpperCase: "One uppercase letter (A-Z)",
                    hasLowerCase: "One lowercase letter (a-z)",
                    hasNumber: "One number (0-9)",
                    hasSpecialChar: "One special character (!@#$%^&*)",
                    noSpaces: "No spaces allowed",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {passwordRequirements[key as keyof PasswordRequirements] ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span
                        className={
                          passwordRequirements[key as keyof PasswordRequirements]
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="garager">Garager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Garage Name - Only when role is garager */}
            {formData.role === "garager" && (
              <div className="space-y-2">
                <Label htmlFor="garageName">Garage Name</Label>
                <Input
                  id="garageName"
                  name="garageName"
                  value={formData.garageName}
                  onChange={handleChange}
                  placeholder="Enter your garage name"
                  className={errors.garageName ? "border-red-500" : ""}
                />
                {errors.garageName && (
                  <p className="text-sm text-red-600">{errors.garageName}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>

            {/* Home Link */}
            <p className="text-center text-sm">
              <Link to="/" className="text-gray-600 hover:underline">
                Back to home
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
