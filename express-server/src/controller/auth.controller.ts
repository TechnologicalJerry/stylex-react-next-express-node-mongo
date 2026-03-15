import { Request, Response } from "express";
import {
  createForgotPasswordMessage,
  loginDemoUser,
  signupDemoUser,
} from "../service/authMemory.service";

function getRequiredString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function signupAuthHandler(req: Request, res: Response) {
  try {
    const name = getRequiredString(req.body?.name);
    const email = getRequiredString(req.body?.email);
    const password = getRequiredString(req.body?.password);

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const session = signupDemoUser({ name, email, password });

    return res.status(201).send({
      success: true,
      message: "Account created successfully.",
      data: { session },
    });
  } catch (error) {
    return res.status(409).send({
      success: false,
      message: error instanceof Error ? error.message : "Signup failed.",
    });
  }
}

export async function loginAuthHandler(req: Request, res: Response) {
  try {
    const email = getRequiredString(req.body?.email);
    const password = getRequiredString(req.body?.password);

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    const session = loginDemoUser({ email, password });

    return res.status(200).send({
      success: true,
      message: "Logged in successfully.",
      data: { session },
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: error instanceof Error ? error.message : "Login failed.",
    });
  }
}

export async function forgotPasswordAuthHandler(req: Request, res: Response) {
  const email = getRequiredString(req.body?.email);

  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Email is required.",
    });
  }

  const result = createForgotPasswordMessage(email);

  return res.status(result.foundUser ? 200 : 404).send({
    success: result.foundUser,
    message: result.message,
  });
}