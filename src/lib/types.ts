export type PageType =
  | "cover"
  | "photo"
  | "text"
  | "skills"
  | "timeline"
  | "contact"
  | "blank";

export interface Credit {
  label: string;
  value: string;
}

export interface CoverContent {
  title: string;
  subtitle: string;
  credits?: Credit[];
}

export interface PhotoContent {
  src: string;
  alt: string;
  caption?: string;
}

export interface TextBlock {
  heading?: string;
  body: string;
}

export interface TextContent {
  blocks: TextBlock[];
  pullQuote?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  category: string;
}

export interface SkillsContent {
  heading: string;
  skills: Skill[];
}

export interface TimelineItem {
  year: string;
  role: string;
  place: string;
  description: string;
}

export interface TimelineContent {
  heading: string;
  items: TimelineItem[];
}

export interface ContactContent {
  heading: string;
  email?: string;
  links: { label: string; url: string }[];
  closing?: string;
}

export interface BlankContent {
  decorative?: boolean;
}

export type PageContent =
  | CoverContent
  | PhotoContent
  | TextContent
  | SkillsContent
  | TimelineContent
  | ContactContent
  | BlankContent;

export interface BookPage {
  type: PageType;
  background?: string;
  texture?: boolean;
  content: PageContent;
}

export interface Spread {
  id: number;
  left: BookPage;
  right: BookPage;
}

export interface BookData {
  title: string;
  author: string;
  spreads: Spread[];
}

export type AnimationDirection = "forward" | "backward";

export type BookPhase =
  | { phase: "idle"; spreadIndex: number }
  | {
      phase: "animating";
      fromSpread: number;
      toSpread: number;
      direction: AnimationDirection;
    };
