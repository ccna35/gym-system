import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "../lib/validations";
import { useRegister } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import { t } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenant_id: 1,
      role_id: 2, // Default role for regular users
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              نظام الصالة الرياضية
            </h1>
            <p className="mt-2 text-gray-600">{t.auth.register}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tenant ID */}
            <div>
              <Label htmlFor="tenant_id">Tenant ID</Label>
              <Input
                id="tenant_id"
                type="number"
                {...register("tenant_id", { valueAsNumber: true })}
              />
              {errors.tenant_id && (
                <p className="error-message">{errors.tenant_id.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">{t.auth.name}</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="error-message">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">{t.members.phone} (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="error-message">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role ID (hidden for now) */}
            <input
              type="hidden"
              {...register("role_id", { valueAsNumber: true })}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin ml-2" size={20} />
                  {t.common.loading}
                </>
              ) : (
                t.auth.signUp
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.auth.alreadyHaveAccount}{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t.auth.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
