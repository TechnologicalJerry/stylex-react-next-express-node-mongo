import { nanoid } from "nanoid";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

type PublicDemoUser = Omit<DemoUser, "password">;

export type DemoSession = {
  token: string;
  user: PublicDemoUser;
  createdAt: string;
};

type NewUserInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const users: DemoUser[] = [];

function sanitizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: DemoUser): PublicDemoUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function buildSession(user: DemoUser): DemoSession {
  return {
    token: nanoid(24),
    user: toPublicUser(user),
    createdAt: new Date().toISOString(),
  };
}

export function signupDemoUser(input: NewUserInput): DemoSession {
  const email = sanitizeEmail(input.email);
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const user: DemoUser = {
    id: nanoid(12),
    name: input.name.trim(),
    email,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return buildSession(user);
}

export function loginDemoUser(input: LoginInput): DemoSession {
  const email = sanitizeEmail(input.email);
  const user = users.find((entry) => entry.email === email);

  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password.");
  }

  return buildSession(user);
}

export function createForgotPasswordMessage(email: string): {
  foundUser: boolean;
  message: string;
} {
  const normalizedEmail = sanitizeEmail(email);
  const foundUser = users.some((user) => user.email === normalizedEmail);

  if (foundUser) {
    return {
      foundUser,
      message:
        "Password reset instructions were generated for this account (demo mode).",
    };
  }

  return {
    foundUser,
    message:
      "No account found for that email. In production, this response is usually generic for security.",
  };
}