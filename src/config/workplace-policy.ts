import type { ElementType } from "react";
import {
  Users,
  HeartHandshake,
  Laptop,
  Scale,
  Lock,
  GraduationCap,
  Heart,
  ShieldCheck,
  Cpu,
  Trophy,
} from "lucide-react";

export interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: ElementType;
  highlight: string;
  paragraphs: string[];
  actionLink?: {
    text: string;
    href: string;
  };
}

export const WORKPLACE_POLICY_URL = "https://khelgrid.com/workplace-policy";
export const WORKPLACE_CONTACT_EMAIL = "khelgrid@gmail.com";
export const WORKPLACE_PRINCIPLE =
  "Building a better sports ecosystem starts with building a better workplace.";

export const WORKPLACE_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "equal-opportunity-inclusion",
    number: "01",
    title: "Equal Opportunity and Inclusion",
    icon: Users,
    highlight: "Merit, diversity & equal opportunity for all",
    paragraphs: [
      "KhelGrid supports equal employment opportunities regardless of gender, age, disability, background or personal identity. We aim to build a diverse and inclusive workplace.",
      "All recruitment, evaluation, promotion, and professional development decisions are conducted based solely on demonstrated capability, role requirements, and merit.",
    ],
  },
  {
    id: "respectful-workplace",
    number: "02",
    title: "Respectful Workplace",
    icon: HeartHandshake,
    highlight: "Zero-tolerance for harassment, discrimination, or bullying",
    paragraphs: [
      "We maintain a zero-tolerance approach towards harassment, discrimination, bullying, intimidation and inappropriate workplace behaviour.",
      "Everyone is expected to treat colleagues and collaborators with dignity and respect across all in-person, remote, and digital interactions.",
    ],
  },
  {
    id: "flexible-remote-working",
    number: "03",
    title: "Flexible and Remote Working",
    icon: Laptop,
    highlight: "Empowering talent across cities & sports hubs",
    paragraphs: [
      "KhelGrid supports flexible working arrangements where operational requirements permit. Remote and hybrid collaboration may be used to support productivity and access to talent across different locations.",
      "Team members are empowered with autonomy while adhering to clear standards of responsiveness, transparency, and collaborative alignment.",
    ],
  },
  {
    id: "professional-ethics",
    number: "04",
    title: "Professional Ethics",
    icon: Scale,
    highlight: "Honesty, accountability & institutional integrity",
    paragraphs: [
      "All team members are expected to demonstrate honesty, accountability, transparency and professionalism in their work and business interactions.",
      "We uphold the integrity of Indian sports data, preventing conflicts of interest, misrepresentation, or unauthorized commercial influences across the platform.",
    ],
  },
  {
    id: "data-privacy-confidentiality",
    number: "05",
    title: "Data Privacy and Confidentiality",
    icon: Lock,
    highlight: "Protecting athlete records, proprietary algorithms & user trust",
    paragraphs: [
      "We expect everyone working with KhelGrid to protect confidential business information, personal data, intellectual property and platform security.",
      "Athlete records, scouting evaluations, and partner communications are treated with strict confidentiality under Indian data protection standards.",
    ],
  },
  {
    id: "learning-development",
    number: "06",
    title: "Learning and Development",
    icon: GraduationCap,
    highlight: "Continuous learning & professional career advancement",
    paragraphs: [
      "We encourage continuous learning, skill development, innovation and knowledge sharing. We aim to create opportunities for individuals to develop professionally.",
      "Our team is encouraged to experiment, acquire modern technical and sporting domain expertise, and contribute to pioneering grassroots initiatives.",
    ],
  },
  {
    id: "health-safety",
    number: "07",
    title: "Health and Safety",
    icon: Heart,
    highlight: "Promoting physical wellness, mental health & sustainable balance",
    paragraphs: [
      "We are committed to maintaining a safe and healthy working environment and promoting physical and mental well-being.",
      "We promote sustainable working habits, reasonable boundaries, and supportive team dynamics that reflect our passion for healthy athletic living.",
    ],
  },
  {
    id: "posh-compliance",
    number: "08",
    title: "Prevention of Sexual Harassment (POSH)",
    icon: ShieldCheck,
    highlight: "Statutory compliance under applicable Indian workplace laws",
    paragraphs: [
      "KhelGrid is committed to preventing sexual harassment and maintaining a safe workplace. Applicable Indian workplace laws and POSH requirements will be followed.",
      "Our dedicated Internal Complaints Committee (ICC) ensures accessible, confidential, and prompt redressal of any concerns.",
    ],
    actionLink: {
      text: "View Detailed POSH Policy & Procedures",
      href: "/posh-policy",
    },
  },
  {
    id: "responsible-use-of-technology",
    number: "09",
    title: "Responsible Use of Technology",
    icon: Cpu,
    highlight: "Ethical AI, digital asset protection & cybersecurity",
    paragraphs: [
      "Team members must use company systems, digital tools, AI technologies and business resources responsibly, ethically and securely.",
      "AI systems and automated workflows must be leveraged transparently, ensuring they champion authentic athlete visibility without copyright infringement or unfair biases.",
    ],
  },
  {
    id: "our-commitment",
    number: "10",
    title: "Our Commitment",
    icon: Trophy,
    highlight: "Building a better sports ecosystem starts with building a better workplace",
    paragraphs: [
      "KhelGrid aims to build a workplace where people are respected, ideas are valued, accountability is encouraged and everyone has an opportunity to contribute to India's sporting ecosystem.",
      "By championing fairness and excellence in our workplace, we reinforce our dedication to empowering athletes, coaches, and sports communities across India.",
    ],
  },
];
