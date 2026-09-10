export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface ContentPage {
  /** Route path, e.g. "/verify" */
  path: string;
  eyebrow: string;
  title: string;
  /** Used as the meta description and the intro paragraph. */
  description: string;
  /** ISO date shown as "Last updated". */
  updated: string;
  readMins: number;
  intro: string[];
  sections: Section[];
  faqs: Faq[];
  cta?: { to: string; label: string };
}
