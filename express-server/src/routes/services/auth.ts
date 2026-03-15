import { Router } from 'express';
import { z } from 'zod';

type AuthUser = {
  name: string;
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
  email: z.email()
});

const authUsers = new Map<string, AuthUser>([
  [
    'demo@pulseboard.app',
    {
      name: 'Demo User',
      email: 'demo@pulseboard.app',
      password: 'demo123'
    }
  ]
]);

export const authServiceRouter = Router();

authServiceRouter.get('/health', (_req, res) => {
  res.json({
    service: 'auth',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

authServiceRouter.get('/', (_req, res) => {
  res.json({
    service: 'auth',
    message: 'auth service ready',
    endpoints: ['POST /login', 'POST /signup', 'POST /forgot-password']
  });
});

authServiceRouter.post('/signup', (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Please provide name, email, and password.'
    });
    return;
  }

  const email = parsed.data.email.toLowerCase();

  if (authUsers.has(email)) {
    res.status(409).json({
      message: 'An account with that email already exists.'
    });
    return;
  }

  const user: AuthUser = {
    ...parsed.data,
    email
  };

  authUsers.set(email, user);

  res.status(201).json({
    message: 'Account created successfully.',
    session: {
      name: user.name,
      email: user.email
    }
  });
});

authServiceRouter.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Please provide email and password.'
    });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const user = authUsers.get(email);

  if (!user || user.password !== parsed.data.password) {
    res.status(401).json({
      message: 'Invalid email or password.'
    });
    return;
  }

  res.json({
    message: 'Login successful.',
    session: {
      name: user.name,
      email: user.email
    }
  });
});

authServiceRouter.post('/forgot-password', (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Please provide a valid email address.'
    });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const user = authUsers.get(email);

  res.json({
    message: user
      ? `Reset instructions were sent to ${email}.`
      : `If ${email} exists, reset instructions have been sent.`
  });
});
