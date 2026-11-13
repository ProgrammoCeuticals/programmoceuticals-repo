import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/zod-resolver";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FormField, Input } from "@rims/ui";
import api from "../../lib/api";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      await api.post("/auth/reset-password", {
        token,
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const e = err as Error;
      setServerError(
        e.message ?? "Failed to reset password. The link may have expired.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">RIMS</h1>
          <p className="mt-1 text-sm text-slate-500">Set a new password</p>
        </div>

        {success ? (
          <div
            role="status"
            className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center"
          >
            Password reset! Please log in.
          </div>
        ) : (
          <>
            {serverError && (
              <div
                role="alert"
                className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <FormField
                label="New password"
                htmlFor="password"
                error={errors.password?.message}
                required
              >
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
              </FormField>

              <FormField
                label="Confirm password"
                htmlFor="confirm"
                error={errors.confirm?.message}
                required
              >
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  error={errors.confirm?.message}
                  {...register("confirm")}
                />
              </FormField>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Reset password
              </Button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        A ProgrammoCeuticals Product
      </p>
    </div>
  );
}
