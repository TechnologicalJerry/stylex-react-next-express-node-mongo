"use client";

import * as stylex from "@stylexjs/stylex";
import { FormEvent } from "react";
import { styles } from "./styles";

export type AuthField = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
};

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerPrompt: string;
  footerAction: string;
  notice: string;
  loading?: boolean;
  fields: AuthField[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFooterClick: () => void;
  onAltActionClick?: () => void;
  altActionLabel?: string;
};

export function AuthForm(props: AuthFormProps) {
  return (
    <>
      <p {...stylex.props(styles.notice)}>{props.notice}</p>

      <form onSubmit={props.onSubmit} {...stylex.props(styles.form)}>
        <div>
          <h3 {...stylex.props(styles.formTitle)}>{props.title}</h3>
          <p {...stylex.props(styles.formSubtitle)}>{props.subtitle}</p>
        </div>

        {props.fields.map((field) => (
          <label key={field.name} {...stylex.props(styles.field)}>
            <span {...stylex.props(styles.fieldLabel)}>{field.label}</span>
            <input
              required
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              {...stylex.props(styles.input)}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={props.loading}
          {...stylex.props(styles.primaryButton)}
        >
          {props.loading ? "Please wait..." : props.submitLabel}
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
    </>
  );
}
