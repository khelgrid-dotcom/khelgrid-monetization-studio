export interface AthleteTestimonial {
  id: string;
  athlete: string;
  sport: string;
  avatar: string;
  quote: string;
  context: string;
  date: string;
  isExample: boolean;
}

export interface AthleteMilestone {
  id: string;
  athlete: string;
  sport: string;
  achievement: string;
  metric: string;
  date: string;
  isExample: boolean;
}

export const ATHLETE_TESTIMONIALS: AthleteTestimonial[] = [
  {
    id: "testimonial-1",
    athlete: "Meera S.",
    sport: "Athletics",
    avatar: "MS",
    quote:
      "Writing down the event, date and conditions made my progress easier to discuss with my coach. I stopped treating every practice session like a trial.",
    context: "Training reflection",
    date: "2026-03-09",
    isExample: true,
  },
  {
    id: "testimonial-2",
    athlete: "Arjun M.",
    sport: "Cricket",
    avatar: "AM",
    quote:
      "The most useful change was checking the organizer's notice before I planned travel. I had clearer questions and a much calmer trial morning.",
    context: "Trial preparation reflection",
    date: "2026-03-06",
    isExample: true,
  },
  {
    id: "testimonial-3",
    athlete: "Priya K.",
    sport: "Badminton",
    avatar: "PK",
    quote:
      "Keeping a short match log helped me explain what I am working on instead of sending a vague highlight message to every academy.",
    context: "Sports CV reflection",
    date: "2026-03-02",
    isExample: true,
  },
];

export const ATHLETE_MILESTONES: AthleteMilestone[] = [
  {
    id: "milestone-1",
    athlete: "Sneha P.",
    sport: "Athletics",
    achievement: "Added a documented personal-best entry",
    metric: "400m training log updated",
    date: "2026-03-08",
    isExample: true,
  },
  {
    id: "milestone-2",
    athlete: "Kabir S.",
    sport: "Football",
    achievement: "Completed a four-week skill review",
    metric: "12 focused sessions recorded",
    date: "2026-03-04",
    isExample: true,
  },
  {
    id: "milestone-3",
    athlete: "Riya T.",
    sport: "Swimming",
    achievement: "Built a competition preparation checklist",
    metric: "Equipment and travel plan ready",
    date: "2026-02-28",
    isExample: true,
  },
];
