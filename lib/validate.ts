import { contactTypes } from "./data";

export type ContactInput = {
  name: string;
  email: string;
  type: (typeof contactTypes)[number];
  message: string;
};

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; errors: Partial<Record<keyof ContactInput, string>> };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function clean(v: unknown): string {
  // Strip control characters except newline and tab, then trim.
  return typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";
}

export function validateContact(body: unknown): ValidationResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const name = clean(b.name);
  const email = clean(b.email);
  const message = clean(b.message);
  const typeRaw = clean(b.type);
  const errors: Partial<Record<keyof ContactInput, string>> = {};

  if (name.length < 2) errors.name = "Enter your name.";
  else if (name.length > 80) errors.name = "Keep your name under 80 characters.";

  if (!EMAIL.test(email) || email.length > 120) errors.email = "Enter an email address like name@company.com.";

  if (message.length < 10) errors.message = "Write at least a sentence so I know what you need.";
  else if (message.length > 4000) errors.message = "Keep the message under 4000 characters.";

  const type = (contactTypes as readonly string[]).includes(typeRaw) ? (typeRaw as ContactInput["type"]) : "Something else";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, type, message } };
}
