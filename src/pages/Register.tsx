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

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noSpaces: boolean;
}

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
    return Object.values(requirements).every(req => req === true);
  };

  // Calculate password strength
  const getPasswordStrength = (): string => {
    const requirements = Object.values(passwordRequirements).filter(req => req === true).length;
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
    if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
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
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual registration API call
      // Example API call structure:
      /*
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password, // Will be hashed on backend
          role: formData.role,
          ...(formData.role === 'garager' && { garageName: formData.garageName.trim() }),
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      // Store authentication token
      localStorage.setItem('authToken', data.token);
      */

      console.log("Registration attempt:", {
        ...formData,
        password: "[REDACTED]", // Don't log actual password
      });

      // Save user role to localStorage for navbar/dashboard
      localStorage.setItem("userRole", formData.role);

      // Redirect based on role
      if (formData.role === "user") navigate("/dashboard");
      else if (formData.role === "garager") navigate("/garager-dashboard");
      else if (formData.role === "admin") navigate("/admin-dashboard");
    } catch (error) {
      setErrors({
        submit: "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-garage-dark">
            Create Account
          </CardTitle>
          <CardDescription>
            Join Wheelix to find trusted garages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
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
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
                <div className="mt-2">
                  <p className={`text-sm font-medium ${getStrengthColor()}`}>
                    Password Strength: {getPasswordStrength()}
                  </p>
                </div>
              )}

              {/* Password Requirements Checklist */}
              {formData.password && (
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-medium text-gray-700">Password must contain:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordRequirements.minLength ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.minLength ? "text-green-600" : "text-gray-600"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasUpperCase ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.hasUpperCase ? "text-green-600" : "text-gray-600"}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasLowerCase ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.hasLowerCase ? "text-green-600" : "text-gray-600"}>
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasNumber ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.hasNumber ? "text-green-600" : "text-gray-600"}>
                        One number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasSpecialChar ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.hasSpecialChar ? "text-green-600" : "text-gray-600"}>
                        One special character (!@#$%^&*)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.noSpaces ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                      <span className={passwordRequirements.noSpaces ? "text-green-600" : "text-gray-600"}>
                        No spaces allowed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                aria-label="Select Role"
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
                  placeholder="Enter garage name"
                  value={formData.garageName}
                  onChange={handleChange}
                  className={errors.garageName ? "border-red-500" : ""}
                />
                {errors.garageName && (
                  <p className="text-sm text-red-600">{errors.garageName}</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:underline mt-2 block"
            >
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
