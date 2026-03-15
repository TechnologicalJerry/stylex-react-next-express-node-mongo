"use client";

import * as stylex from "@stylexjs/stylex";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "./auth-form";
import { PulseboardShell } from "./shell";
import { styles } from "./styles";
import {
  forgotPassword,
  login,
  signup,
  type ForgotPasswordPayload,
  type LoginPayload,
  type SignupPayload,
} from "@/lib/auth/api";
import {
  storeSession,
  useStoredSessionSnapshot,
} from "@/lib/auth/session";

type Mode = "login" | "signup" | "forgot-password";

const screenConfig: Record<
  Mode,
  {
    title: string;
    copy: string;
    heading: string;
    subtitle: string;
    submitLabel: string;
  }
> = {
  login: {
    title: "Secure team access, now on real routes.",
    copy:
      "Sign in from a dedicated page, keep the dashboard behind session state, and use the same visual system across every auth screen.",
    heading: "Login",
    subtitle: "Sign in to access your Pulseboard dashboard.",
    submitLabel: "Sign in",
  },
  signup: {
    title: "Create an account and land in the workspace.",
    copy:
      "The signup screen now posts to Express and stores a resilient local session only after the request succeeds.",
    heading: "Sign up",
    subtitle: "Create a demo account for the Pulseboard workspace.",
    submitLabel: "Create account",
  },
  "forgot-password": {
    title: "Recover access without leaving the flow.",
    copy:
      "Forgot-password is now its own route too, with the same shell and API wiring so the experience feels complete rather than mocked in place.",
    heading: "Forgot password",
    subtitle: "We will send a reset link to your email address.",
    submitLabel: "Send reset link",
  },
};

export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useStoredSessionSnapshot();
  const defaultNotice =
    searchParams.get("notice") ??
    (mode === "forgot-password"
      ? "Enter your email and we will send reset instructions."
      : "Use any valid email and password to try the auth flow.");
  const [notice, setNotice] = useState(defaultNotice);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [router, session]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (mode === "login") {
        const payload: LoginPayload = {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        };
        const result = await login(payload);
        storeSession(result.session);
        router.push("/dashboard");
        return;
      }

      if (mode === "signup") {
        const payload: SignupPayload = {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        };
        const result = await signup(payload);
        storeSession(result.session);
        router.push("/dashboard");
        return;
      }

      const payload: ForgotPasswordPayload = {
        email: String(formData.get("email") ?? ""),
      };
      const result = await forgotPassword(payload);
      router.push(`/login?notice=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (session === undefined) {
    return (
      <PulseboardShell
        title={screenConfig[mode].title}
        copy={screenConfig[mode].copy}
      >
        <section {...stylex.props(styles.surfaceCard, styles.loaderCard)}>
          <p {...stylex.props(styles.notice)}>Loading your session...</p>
        </section>
      </PulseboardShell>
    );
  }

  if (session) {
    return null;
  }

  return (
    <PulseboardShell
      title={screenConfig[mode].title}
      copy={screenConfig[mode].copy}
    >
      <section {...stylex.props(styles.surfaceCard)}>
        <div {...stylex.props(styles.surfaceHeader)}>
          <div>
            <p {...stylex.props(styles.eyebrow)}>Workspace access</p>
            <h2 {...stylex.props(styles.surfaceTitle)}>
              {mode === "forgot-password" ? "Reset access" : "Welcome back"}
            </h2>
          </div>
        </div>

        <AuthForm
          title={screenConfig[mode].heading}
          subtitle={screenConfig[mode].subtitle}
          submitLabel={screenConfig[mode].submitLabel}
          notice={notice}
          loading={loading}
          footerPrompt={
            mode === "signup"
              ? "Already have access?"
              : mode === "forgot-password"
                ? "Remembered your password?"
                : "Need a new workspace?"
          }
          footerAction={
            mode === "signup"
              ? "Back to login"
              : mode === "forgot-password"
                ? "Back to login"
                : "Create account"
          }
          onSubmit={onSubmit}
          onFooterClick={() =>
            router.push(mode === "login" ? "/signup" : "/login")
          }
          altActionLabel={mode === "login" ? "Forgot password?" : undefined}
          onAltActionClick={
            mode === "login" ? () => router.push("/forgot-password") : undefined
          }
          fields={
            mode === "signup"
              ? [
                  {
                    label: "Full name",
                    name: "name",
                    type: "text",
                    placeholder: "Aarav Shah",
                    autoComplete: "name",
                  },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    placeholder: "you@company.com",
                    autoComplete: "email",
                  },
                  {
                    label: "Password",
                    name: "password",
                    type: "password",
                    placeholder: "Create a password",
                    autoComplete: "new-password",
                  },
                ]
              : mode === "forgot-password"
                ? [
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      placeholder: "you@company.com",
                      autoComplete: "email",
                    },
                  ]
                : [
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      placeholder: "you@company.com",
                      autoComplete: "email",
                    },
                    {
                      label: "Password",
                      name: "password",
                      type: "password",
                      placeholder: "Enter your password",
                      autoComplete: "current-password",
                    },
                  ]
          }
        />
      </section>
    </PulseboardShell>
  );
}
