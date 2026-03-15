"use client";

import { FormEvent, useState } from "react";
import * as stylex from "@stylexjs/stylex";

type View = "login" | "signup" | "forgot" | "dashboard";

type Session = {
  email: string;
  name: string;
};

type Stat = {
  label: string;
  value: string;
  detail: string;
};

type Activity = {
  title: string;
  time: string;
  tone: "calm" | "accent" | "warning";
};

const SESSION_KEY = "pulseboard-session";

const stats: Stat[] = [
  { label: "Active projects", value: "12", detail: "+3 this week" },
  { label: "Open tasks", value: "38", detail: "9 high priority" },
  { label: "Team health", value: "94%", detail: "Strong delivery rhythm" },
];

const activity: Activity[] = [
  { title: "Design handoff approved for the onboarding refresh", time: "12 min ago", tone: "accent" },
  { title: "API smoke checks completed successfully", time: "47 min ago", tone: "calm" },
  { title: "Billing import needs review before 5 PM", time: "1 hr ago", tone: "warning" },
];

const teammates = [
  { name: "Aarav Shah", role: "Frontend lead", status: "Reviewing auth copy" },
  { name: "Mia Turner", role: "Product designer", status: "Preparing dashboard states" },
  { name: "Leo Grant", role: "Backend engineer", status: "Mocking reset token flow" },
];

function readStoredSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedSession = window.localStorage.getItem(SESSION_KEY);

  return savedSession ? (JSON.parse(savedSession) as Session) : null;
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(() => readStoredSession());
  const [view, setView] = useState<View>(() => (readStoredSession() ? "dashboard" : "login"));
  const [notice, setNotice] = useState<string>(() => {
    const savedSession = readStoredSession();

    return savedSession
      ? `Welcome back, ${savedSession.name}.`
      : "Use any email and password to try the flow.";
  });

  const activateSession = (nextSession: Session, nextNotice: string) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setView("dashboard");
    setNotice(nextNotice);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setNotice("Add both email and password to continue.");
      return;
    }

    activateSession(
      {
        email,
        name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").trim() || "Team member",
      },
      "Login successful. Your dashboard is ready."
    );
  };

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password) {
      setNotice("Complete all signup fields to create the demo account.");
      return;
    }

    activateSession({ email, name }, "Account created. You are now signed in.");
  };

  const handleForgotPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    if (!email) {
      setNotice("Enter your email so we can send the reset message.");
      return;
    }

    setNotice(`Reset instructions were sent to ${email}.`);
    setView("login");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setView("login");
    setNotice("You have been logged out.");
  };

  return (
    <main {...stylex.props(styles.pageShell)}>
      <div {...stylex.props(styles.backgroundGlow, styles.glowTop)} />
      <div {...stylex.props(styles.backgroundGlow, styles.glowBottom)} />

      <section {...stylex.props(styles.heroPanel)}>
        <div {...stylex.props(styles.kicker)}>Pulseboard workspace</div>
        <h1 {...stylex.props(styles.heroTitle)}>
          Auth screens and dashboard built with StyleX.
        </h1>
        <p {...stylex.props(styles.heroCopy)}>
          Switch between login, signup, and forgot password, then land on a
          dashboard with three mock components that feel like part of a real app.
        </p>
        <div {...stylex.props(styles.heroBadgeRow)}>
          <Badge label="StyleX UI" value="Atomic styles" />
          <Badge label="State" value="Local demo auth" />
          <Badge label="Ready for API" value="Replace handlers later" />
        </div>
      </section>

      <section {...stylex.props(styles.surfaceCard)}>
        <div {...stylex.props(styles.surfaceHeader)}>
          <div>
            <p {...stylex.props(styles.eyebrow)}>Workspace access</p>
            <h2 {...stylex.props(styles.surfaceTitle)}>
              {view === "dashboard" ? "Dashboard" : "Welcome back"}
            </h2>
          </div>
          {view === "dashboard" && (
            <button
              type="button"
              onClick={handleLogout}
              {...stylex.props(styles.secondaryButton, styles.smallButton)}
            >
              Log out
            </button>
          )}
        </div>

        <p {...stylex.props(styles.notice)}>{notice}</p>

        {view === "login" && (
          <AuthForm
            title="Login"
            subtitle="Sign in to access your team dashboard."
            submitLabel="Sign in"
            footerAction="Create account"
            footerPrompt="Need a new workspace?"
            onSubmit={handleLogin}
            onFooterClick={() => setView("signup")}
            altActionLabel="Forgot password?"
            onAltActionClick={() => setView("forgot")}
            fields={[
              { label: "Email", name: "email", type: "email", placeholder: "you@company.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
            ]}
          />
        )}

        {view === "signup" && (
          <AuthForm
            title="Sign up"
            subtitle="Create a demo account for the Pulseboard workspace."
            submitLabel="Create account"
            footerAction="Back to login"
            footerPrompt="Already have access?"
            onSubmit={handleSignup}
            onFooterClick={() => setView("login")}
            fields={[
              { label: "Full name", name: "name", type: "text", placeholder: "Aarav Shah" },
              { label: "Email", name: "email", type: "email", placeholder: "you@company.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Create a password" },
            ]}
          />
        )}

        {view === "forgot" && (
          <AuthForm
            title="Forgot password"
            subtitle="We will send a reset link to your email address."
            submitLabel="Send reset link"
            footerAction="Back to login"
            footerPrompt="Remembered your password?"
            onSubmit={handleForgotPassword}
            onFooterClick={() => setView("login")}
            fields={[
              { label: "Email", name: "email", type: "email", placeholder: "you@company.com" },
            ]}
          />
        )}

        {view === "dashboard" && session && (
          <div {...stylex.props(styles.dashboardStack)}>
            <div {...stylex.props(styles.dashboardHeader)}>
              <div>
                <p {...stylex.props(styles.eyebrow)}>Signed in as</p>
                <h3 {...stylex.props(styles.dashboardTitle)}>{session.name}</h3>
                <p {...stylex.props(styles.dashboardSubtitle)}>{session.email}</p>
              </div>
              <div {...stylex.props(styles.statusPill)}>Live demo data</div>
            </div>

            <div {...stylex.props(styles.dashboardGrid)}>
              <OverviewPanel />
              <ActivityPanel />
              <TeamPanel />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div {...stylex.props(styles.badge)}>
      <span {...stylex.props(styles.badgeLabel)}>{label}</span>
      <strong {...stylex.props(styles.badgeValue)}>{value}</strong>
    </div>
  );
}

type AuthField = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
};

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerPrompt: string;
  footerAction: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFooterClick: () => void;
  onAltActionClick?: () => void;
  altActionLabel?: string;
  fields: AuthField[];
};

function AuthForm(props: AuthFormProps) {
  return (
    <form onSubmit={props.onSubmit} {...stylex.props(styles.form)}>
      <div>
        <h3 {...stylex.props(styles.formTitle)}>{props.title}</h3>
        <p {...stylex.props(styles.formSubtitle)}>{props.subtitle}</p>
      </div>

      {props.fields.map((field) => (
        <label key={field.name} {...stylex.props(styles.field)}>
          <span {...stylex.props(styles.fieldLabel)}>{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...stylex.props(styles.input)}
          />
        </label>
      ))}

      <button type="submit" {...stylex.props(styles.primaryButton)}>
        {props.submitLabel}
      </button>

      <div {...stylex.props(styles.formFooter)}>
        <span {...stylex.props(styles.footerText)}>{props.footerPrompt}</span>
        <button
          type="button"
          onClick={props.onFooterClick}
          {...stylex.props(styles.inlineButton)}
        >
          {props.footerAction}
        </button>
      </div>

      {props.onAltActionClick && props.altActionLabel && (
        <button
          type="button"
          onClick={props.onAltActionClick}
          {...stylex.props(styles.ghostButton)}
        >
          {props.altActionLabel}
        </button>
      )}
    </form>
  );
}

function OverviewPanel() {
  return (
    <section {...stylex.props(styles.dashboardCard, styles.cardTall)}>
      <div {...stylex.props(styles.cardHeader)}>
        <h4 {...stylex.props(styles.cardTitle)}>Overview</h4>
        <span {...stylex.props(styles.cardChip)}>This week</span>
      </div>

      <div {...stylex.props(styles.metricList)}>
        {stats.map((stat) => (
          <div key={stat.label} {...stylex.props(styles.metricItem)}>
            <span {...stylex.props(styles.metricLabel)}>{stat.label}</span>
            <strong {...stylex.props(styles.metricValue)}>{stat.value}</strong>
            <span {...stylex.props(styles.metricDetail)}>{stat.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel() {
  return (
    <section {...stylex.props(styles.dashboardCard)}>
      <div {...stylex.props(styles.cardHeader)}>
        <h4 {...stylex.props(styles.cardTitle)}>Activity</h4>
        <span {...stylex.props(styles.cardChip)}>Realtime</span>
      </div>

      <div {...stylex.props(styles.feed)}>
        {activity.map((item) => (
          <div key={item.title} {...stylex.props(styles.feedItem)}>
            <span {...stylex.props(styles.feedDot, item.tone === "accent" && styles.feedDotAccent, item.tone === "warning" && styles.feedDotWarning)} />
            <div>
              <p {...stylex.props(styles.feedTitle)}>{item.title}</p>
              <p {...stylex.props(styles.feedTime)}>{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamPanel() {
  return (
    <section {...stylex.props(styles.dashboardCard)}>
      <div {...stylex.props(styles.cardHeader)}>
        <h4 {...stylex.props(styles.cardTitle)}>Team</h4>
        <span {...stylex.props(styles.cardChip)}>3 online</span>
      </div>

      <div {...stylex.props(styles.teamList)}>
        {teammates.map((person) => (
          <div key={person.name} {...stylex.props(styles.teamItem)}>
            <div {...stylex.props(styles.avatar)}>{person.name.slice(0, 1)}</div>
            <div>
              <p {...stylex.props(styles.teamName)}>{person.name}</p>
              <p {...stylex.props(styles.teamRole)}>{person.role}</p>
              <p {...stylex.props(styles.teamStatus)}>{person.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = stylex.create({
  pageShell: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "28px",
    padding: "32px",
    position: "relative",
    overflow: "hidden",
    backgroundImage:
      "radial-gradient(circle at top left, rgba(194, 92, 52, 0.18), transparent 28%), linear-gradient(135deg, #f6efdf 0%, #f1dfc5 45%, #e7d3ba 100%)",
    "@media (max-width: 980px)": {
      gridTemplateColumns: "1fr",
      padding: "20px",
    },
  },
  backgroundGlow: {
    position: "absolute",
    borderRadius: "999px",
    filter: "blur(30px)",
    opacity: 0.65,
    pointerEvents: "none",
  },
  glowTop: {
    width: "280px",
    height: "280px",
    top: "-100px",
    right: "12%",
    backgroundColor: "rgba(184, 63, 34, 0.22)",
  },
  glowBottom: {
    width: "320px",
    height: "320px",
    bottom: "-140px",
    left: "-80px",
    backgroundColor: "rgba(46, 122, 108, 0.16)",
  },
  heroPanel: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px",
    padding: "28px 12px",
  },
  kicker: {
    width: "fit-content",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(27, 26, 23, 0.08)",
    color: "#4f3225",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    lineHeight: 0.95,
    maxWidth: "10ch",
    color: "#241811",
  },
  heroCopy: {
    maxWidth: "58ch",
    color: "#5f4a3d",
    fontSize: "1.05rem",
    lineHeight: 1.7,
  },
  heroBadgeRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "10px",
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
  badge: {
    padding: "16px",
    borderRadius: "22px",
    backgroundColor: "rgba(255, 255, 255, 0.48)",
    border: "1px solid rgba(36, 24, 17, 0.08)",
    backdropFilter: "blur(16px)",
  },
  badgeLabel: {
    display: "block",
    color: "#74574a",
    fontSize: "0.82rem",
    marginBottom: "8px",
  },
  badgeValue: {
    color: "#241811",
    fontSize: "1.05rem",
  },
  surfaceCard: {
    position: "relative",
    zIndex: 1,
    borderRadius: "32px",
    padding: "28px",
    backgroundColor: "rgba(255, 250, 244, 0.82)",
    border: "1px solid rgba(36, 24, 17, 0.1)",
    boxShadow: "0 24px 80px rgba(74, 44, 28, 0.12)",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  surfaceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
  },
  eyebrow: {
    color: "#8b6b5d",
    fontSize: "0.76rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "8px",
    fontWeight: 700,
  },
  surfaceTitle: {
    fontSize: "2rem",
    color: "#211611",
  },
  notice: {
    color: "#6a4f41",
    backgroundColor: "#f7ecdf",
    borderRadius: "18px",
    padding: "14px 16px",
    fontSize: "0.96rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formTitle: {
    fontSize: "1.45rem",
    color: "#241811",
    marginBottom: "6px",
  },
  formSubtitle: {
    color: "#74574a",
    lineHeight: 1.6,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fieldLabel: {
    color: "#4a3025",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  input: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(73, 50, 37, 0.14)",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: "14px 16px",
    fontSize: "0.98rem",
    color: "#211611",
    outline: "none",
    transitionDuration: "180ms",
    transitionProperty: "border-color, box-shadow, transform",
    ":focus": {
      borderColor: "#b85d37",
      boxShadow: "0 0 0 4px rgba(184, 93, 55, 0.12)",
      transform: "translateY(-1px)",
    },
  },
  primaryButton: {
    border: "none",
    borderRadius: "16px",
    padding: "14px 18px",
    backgroundColor: "#b85d37",
    color: "#fff8f2",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transitionDuration: "180ms",
    transitionProperty: "transform, box-shadow, background-color",
    boxShadow: "0 14px 28px rgba(184, 93, 55, 0.22)",
    ":hover": {
      transform: "translateY(-1px)",
      backgroundColor: "#a84f2c",
    },
  },
  secondaryButton: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(36, 24, 17, 0.12)",
    borderRadius: "14px",
    padding: "12px 14px",
    backgroundColor: "transparent",
    color: "#3e2a20",
    cursor: "pointer",
    fontWeight: 600,
  },
  smallButton: {
    padding: "10px 12px",
  },
  formFooter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  footerText: {
    color: "#74574a",
  },
  inlineButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#a84f2c",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
  ghostButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#5b7f78",
    fontWeight: 700,
    cursor: "pointer",
    width: "fit-content",
    padding: 0,
  },
  dashboardStack: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  dashboardTitle: {
    fontSize: "1.5rem",
    color: "#241811",
  },
  dashboardSubtitle: {
    color: "#74574a",
  },
  statusPill: {
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(57, 126, 111, 0.12)",
    color: "#25584d",
    fontWeight: 700,
    fontSize: "0.82rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
  dashboardCard: {
    padding: "20px",
    borderRadius: "24px",
    backgroundColor: "#fffdf8",
    border: "1px solid rgba(36, 24, 17, 0.08)",
    boxShadow: "0 12px 32px rgba(74, 44, 28, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardTall: {
    gridRow: "span 2",
    "@media (max-width: 760px)": {
      gridRow: "span 1",
    },
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  cardTitle: {
    fontSize: "1.1rem",
    color: "#241811",
  },
  cardChip: {
    padding: "8px 10px",
    borderRadius: "999px",
    backgroundColor: "#f4ebde",
    color: "#7a5a49",
    fontSize: "0.78rem",
    fontWeight: 700,
  },
  metricList: {
    display: "grid",
    gap: "12px",
  },
  metricItem: {
    padding: "14px",
    borderRadius: "18px",
    backgroundColor: "#f9f3ea",
    display: "grid",
    gap: "6px",
  },
  metricLabel: {
    color: "#74574a",
    fontSize: "0.88rem",
  },
  metricValue: {
    color: "#241811",
    fontSize: "2rem",
    lineHeight: 1,
  },
  metricDetail: {
    color: "#8c6855",
  },
  feed: {
    display: "grid",
    gap: "14px",
  },
  feedItem: {
    display: "grid",
    gridTemplateColumns: "12px 1fr",
    gap: "12px",
    alignItems: "start",
  },
  feedDot: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    marginTop: "6px",
    backgroundColor: "#5b7f78",
  },
  feedDotAccent: {
    backgroundColor: "#b85d37",
  },
  feedDotWarning: {
    backgroundColor: "#c1882f",
  },
  feedTitle: {
    color: "#30211a",
    lineHeight: 1.5,
  },
  feedTime: {
    color: "#8c6855",
    marginTop: "4px",
    fontSize: "0.9rem",
  },
  teamList: {
    display: "grid",
    gap: "14px",
  },
  teamItem: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gap: "12px",
    alignItems: "start",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f0dfcf",
    color: "#6b412f",
    fontWeight: 800,
  },
  teamName: {
    color: "#2d1f18",
    fontWeight: 700,
  },
  teamRole: {
    color: "#8c6855",
    marginTop: "4px",
    fontSize: "0.92rem",
  },
  teamStatus: {
    color: "#496d65",
    marginTop: "6px",
    fontSize: "0.92rem",
  },
});
