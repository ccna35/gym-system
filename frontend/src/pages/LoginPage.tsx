import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../lib/validations";
import { useLogin } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import { t } from "../i18n";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenant_id: 1, // Default tenant for demo
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
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
            <p className="mt-2 text-gray-600">{t.auth.loginSubtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tenant ID */}
            <div>
              <label htmlFor="tenant_id" className="label">
                Tenant ID
              </label>
              <input
                id="tenant_id"
                type="number"
                className="input"
                {...register("tenant_id", { valueAsNumber: true })}
              />
              {errors.tenant_id && (
                <p className="error-message">{errors.tenant_id.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                {t.auth.password}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin ml-2" size={20} />
                  {t.common.loading}
                </>
              ) : (
                t.auth.signIn
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.auth.dontHaveAccount}{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
