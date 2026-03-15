"use client";

import * as stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { styles } from "./styles";

export function PulseboardShell(props: {
  title: string;
  copy: string;
  compactHero?: boolean;
  singleColumn?: boolean;
  children: ReactNode;
}) {
  return (
    <main
      {...stylex.props(
        styles.pageShell,
        props.singleColumn && styles.pageShellSingle
      )}
    >
      <div {...stylex.props(styles.backgroundGlow, styles.glowTop)} />
      <div {...stylex.props(styles.backgroundGlow, styles.glowBottom)} />

      <section
        {...stylex.props(
          styles.heroPanel,
          props.compactHero && styles.heroPanelCompact
        )}
      >
        <div {...stylex.props(styles.kicker)}>Pulseboard workspace</div>
        <h1
          {...stylex.props(
            styles.heroTitle,
            props.compactHero && styles.heroTitleCompact
          )}
        >
          {props.title}
        </h1>
        <p {...stylex.props(styles.heroCopy)}>{props.copy}</p>
        <div {...stylex.props(styles.heroBadgeRow)}>
          <Badge label="Routes" value="Real Next pages" />
          <Badge label="State" value="Hydration-safe session" />
          <Badge label="Auth API" value="Express wired" />
        </div>
      </section>

      {props.children}
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
