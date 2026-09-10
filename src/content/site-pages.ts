import type { ContentPage } from "./types";

const UPDATED = "2026-09-01";

export const contactPage: ContentPage = {
  path: "/contact",
  eyebrow: "Contact",
  title: "Contact KhelGrid",
  description:
    "Reach the KhelGrid team: report a fake trial, correct a listing, list your academy, ask about advertising, or raise a privacy request.",
  updated: UPDATED,
  readMins: 3,
  intro: [
    "We are a small team and we read everything that comes in. Email is the fastest route, and using the right subject line gets your message to the right person quickly.",
    "Email: khelgrid@gmail.com. We aim to reply within three working days; reports of fake trials or safety concerns are looked at the same day wherever possible.",
  ],
  sections: [
    {
      heading: "Which subject line to use",
      blocks: [
        {
          type: "table",
          head: ["Your reason for writing", "Subject line"],
          rows: [
            ["A listing looks fake or unsafe", "REPORT — fake trial"],
            ["A date, fee or detail is wrong", "CORRECTION — listing link"],
            ["List an academy, trial or venue", "LISTING — organiser name"],
            ["Advertising and partnerships", "ADS — company name"],
            ["Privacy, data access or deletion", "PRIVACY — your request"],
            ["Press and media", "PRESS — publication"],
            ["Anything else", "SUPPORT — short description"],
          ],
        },
        {
          type: "note",
          text: "Reporting a suspicious trial? Include the listing link, the organiser's phone number or UPI ID if payment was requested, and screenshots of the messages. That is usually enough for us to act immediately.",
        },
      ],
    },
    {
      heading: "What we can and cannot help with",
      blocks: [
        {
          type: "list",
          items: [
            "We can correct or remove a listing, verify an organiser, and add your event or academy to the site.",
            "We can explain a pathway, point you to the right association, and answer questions about how this site works.",
            "We cannot select you, recommend you to a selector, or influence any trial outcome — KhelGrid has no role in selection.",
            "We cannot give medical or injury advice; please see a doctor or a qualified physiotherapist.",
            "We cannot confirm eligibility rules on behalf of a federation; the relevant association is the only authority on that.",
          ],
        },
      ],
    },
    {
      heading: "For academies, coaches and organisers",
      blocks: [
        {
          type: "p",
          text: "Listing on KhelGrid is free. Send the event or academy name, sport, city, dates, age bands, fees, the organising body and a contact number. For a verified label we will additionally ask for proof of the organiser's identity and either an association confirmation or a published calendar entry. Paid promotion is available and always labelled — it cannot buy a verified badge or a place in a guide.",
        },
      ],
    },
    {
      heading: "Privacy and advertising requests",
      blocks: [
        {
          type: "p",
          text: "To access or delete the data we hold about you, write with the subject line PRIVACY and the email address you used on the site. To change your advertising consent at any time, use the 'Cookie settings' link in the footer of any page — it reopens the consent banner so you can switch between personalised and non-personalised ads.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How fast do you reply?",
      a: "Within three working days for general email. Safety reports about a trial or an individual are prioritised and usually reviewed the same day.",
    },
    {
      q: "Do you charge to list a trial or academy?",
      a: "No. Listing is free. Optional paid promotion exists, is clearly labelled, and has no effect on verification.",
    },
    {
      q: "Can you help me get selected?",
      a: "No. We publish opportunities and explain the process; selection is entirely in the hands of the associations and academies running each trial.",
    },
  ],
  cta: { to: "/about", label: "Read about KhelGrid" },
};

export const editorialPolicyPage: ContentPage = {
  path: "/editorial-policy",
  eyebrow: "Editorial standards",
  title: "Editorial policy: how KhelGrid researches, writes and corrects",
  description:
    "Our standards for sourcing, verification, advertising independence, use of AI and corrections — so you know how far to trust anything published on KhelGrid.",
  updated: UPDATED,
  readMins: 5,
  intro: [
    "KhelGrid publishes information that families act on with their money and their children's time. This page sets out the rules we hold ourselves to, so you can judge our work rather than take it on faith.",
  ],
  sections: [
    {
      heading: "Sourcing",
      blocks: [
        {
          type: "list",
          items: [
            "Rules, calendars and eligibility come from federations, state associations and government sports schemes, and we point to the body that publishes them rather than restating figures that change annually.",
            "Listing details come from the organiser, and we say so. Where we have confirmed them independently, the listing is marked verified.",
            "Training, nutrition and recovery guidance reflects mainstream sports-science practice; it is general information, not individual medical advice.",
            "We do not publish statistics, testimonials or results we cannot substantiate. Where a claim is our own estimate or opinion, we label it as such.",
          ],
        },
      ],
    },
    {
      heading: "Verification of listings",
      blocks: [
        {
          type: "steps",
          items: [
            "Confirm the organiser's identity and working contact details.",
            "Match the event against the relevant association's calendar or a written confirmation.",
            "Check that no payment is requested in exchange for selection.",
            "Mark the listing verified, or publish it labelled unverified so visitors can apply their own judgement.",
          ],
        },
      ],
    },
    {
      heading: "Advertising independence",
      blocks: [
        {
          type: "p",
          text: "We earn money from optional athlete subscriptions, labelled promotion for organisers, and advertising including Google AdSense. Advertising and promotion are visually separated from editorial content and labelled. No advertiser sees our content before publication, and no payment can create a verified badge, change a guide's recommendation, or remove a safety warning.",
        },
      ],
    },
    {
      heading: "Use of AI",
      blocks: [
        {
          type: "p",
          text: "We use AI tools to help draft and edit, and every page is reviewed by a person on our team before publication. Facts that affect money, eligibility or safety are checked against a primary source or removed. Any AI-assisted feature on the site is labelled, and it will decline to answer rather than guess when it does not have a source.",
        },
      ],
    },
    {
      heading: "Corrections",
      blocks: [
        {
          type: "p",
          text: "Every page carries a last-updated date. If you find an error, write to khelgrid@gmail.com with the page link and the correction. We fix factual errors as soon as we can confirm them, and where a correction is material we note it on the page. Listings that fail our checks are removed regardless of whether the organiser is a paying partner.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is KhelGrid content written by people or by AI?",
      a: "AI tools assist with drafting and editing; a member of our team reviews and is accountable for every published page. Claims affecting money, eligibility or safety are verified against a primary source.",
    },
    {
      q: "Can an advertiser get a better review?",
      a: "No. Promotion buys visibility and is labelled as such. It cannot affect verification, guide recommendations or warnings.",
    },
    {
      q: "How do I request a correction?",
      a: "Email khelgrid@gmail.com with the page link and the specific detail that is wrong, ideally with a source we can check.",
    },
  ],
  cta: { to: "/contact", label: "Contact the team" },
};
