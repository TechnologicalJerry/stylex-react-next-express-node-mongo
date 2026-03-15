"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PulseboardShell } from "./shell";
import { styles } from "./styles";
import {
  clearStoredSession,
  useStoredSessionSnapshot,
} from "@/lib/auth/session";

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

export function DashboardScreen() {
  const router = useRouter();
  const session = useStoredSessionSnapshot();

  useEffect(() => {
    if (session === null) {
      clearStoredSession();
      router.replace("/login");
    }
  }, [router, session]);

  const handleLogout = () => {
    clearStoredSession();
    router.push("/login");
  };

  return (
    <PulseboardShell
      title="Your dashboard now lives on its own route."
      copy="The dashboard is protected by a hydration-safe local session check and opens only after a successful login or signup request."
      compactHero
      singleColumn
    >
      <section
        {...stylex.props(
          styles.surfaceCard,
          styles.surfaceWide,
          session === undefined && styles.loaderCard
        )}
      >
        {session === undefined && (
          <p {...stylex.props(styles.notice)}>Checking your session...</p>
        )}
        {session === null && (
          <p {...stylex.props(styles.notice)}>Redirecting to login...</p>
        )}
        {session && (
          <>
            <div {...stylex.props(styles.surfaceHeader)}>
              <div>
                <p {...stylex.props(styles.eyebrow)}>Workspace access</p>
                <h2 {...stylex.props(styles.surfaceTitle)}>Dashboard</h2>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                {...stylex.props(styles.secondaryButton, styles.smallButton)}
              >
                Log out
              </button>
            </div>

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
          </>
        )}
      </section>
    </PulseboardShell>
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
            <span
              {...stylex.props(
                styles.feedDot,
                item.tone === "accent" && styles.feedDotAccent,
                item.tone === "warning" && styles.feedDotWarning
              )}
            />
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
