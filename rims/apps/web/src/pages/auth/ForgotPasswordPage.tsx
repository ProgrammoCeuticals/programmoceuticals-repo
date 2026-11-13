import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/zod-resolver";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button, FormField, Input } from "@rims/ui";
import api from "../../lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    try {
      await api.post("/auth/forgot-password", values);
    } catch {
      // Swallow the error — show success regardless to avoid email enumeration
    } finally {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">RIMS</h1>
          <p className="mt-1 text-sm text-slate-500">Reset your password</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div
              role="status"
              className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
            >
              If an account exists for that email address, you will receive a
              password reset link shortly.
            </div>
            <Link
              to="/login"
              className="text-sm text-[#1e3a5f] hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
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

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Send reset link
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              <Link to="/login" className="text-[#1e3a5f] hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        A ProgrammoCeuticals Product
      </p>
    </div>
  );
}
