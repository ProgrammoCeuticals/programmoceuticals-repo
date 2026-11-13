import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/zod-resolver";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormField, Input } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";
import type { ApiResponse } from "@rims/shared-types";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

interface LoginResponseData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
  };
  accessToken: string;
}

interface MeResponseData {
  permissions: string[];
  roleAssignments?: Array<{
    id: string;
    scopeType: string;
    scopeId: string | null;
    role: { id: string; name: string };
  }>;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const { data: loginRes } = await api.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        values,
      );
      const { user, accessToken } = loginRes.data;

      // Fetch permissions and scopes from /me
      let permissions: string[] = [];
      let scopes: import('@rims/shared-types').ScopeAssignment[] = [];
      try {
        const { data: meRes } = await api.get<ApiResponse<MeResponseData>>(
          "/auth/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        permissions = meRes.data.permissions ?? [];
        scopes = (meRes.data.roleAssignments ?? []).map((ra) => ({
          roleId: ra.role.id,
          roleName: ra.role.name,
          scopeType: ra.scopeType as import('@rims/shared-types').ScopeAssignment['scopeType'],
          scopeId: ra.scopeId,
        }));
      } catch {
        // /me failure is non-fatal; proceed with empty permissions
      }

      setAuth(user, accessToken, permissions, scopes);

      const redirect = searchParams.get("redirect");
      navigate(redirect && redirect.startsWith("/") ? redirect : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      const e = err as Error & { code?: string };
      setServerError(e.message ?? "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">RIMS</h1>
          <p className="mt-1 text-sm text-slate-500">
            Research Institute Management System
          </p>
        </div>

        {/* Error alert */}
        {serverError && (
          <div
            role="alert"
            className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            required
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        {/* Forgot password link */}
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link
            to="/forgot-password"
            className="text-[#1e3a5f] hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-slate-400">
        A ProgrammoCeuticals Product
      </p>
    </div>
  );
}
