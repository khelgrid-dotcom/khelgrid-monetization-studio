export interface Trial {
  id: string;
  title: string;
  academy: string;
  sport: string;
  city: string;
  date: string;
  fee: number;
  spots: number;
  tag: string;
}

export const TRIALS: Trial[] = [
  { id: "t-1", title: "U-19 Cricket Selection Camp", academy: "Capital Cricket Academy", sport: "Cricket", city: "Delhi", date: "Mar 14, 2026", fee: 0, spots: 32, tag: "Open" },
  { id: "t-2", title: "Pro Football Combine 2026", academy: "Mumbai United FC", sport: "Football", city: "Mumbai", date: "Mar 21, 2026", fee: 0, spots: 60, tag: "Scouted" },
  { id: "t-3", title: "Elite Badminton Pathway", academy: "Pullela Gopichand Academy", sport: "Badminton", city: "Hyderabad", date: "Apr 02, 2026", fee: 0, spots: 24, tag: "Premium" },
  { id: "t-4", title: "State Athletics Trials", academy: "Sports Authority of Karnataka", sport: "Athletics", city: "Bengaluru", date: "Apr 10, 2026", fee: 0, spots: 120, tag: "Official" },
  { id: "t-5", title: "Junior Hockey Showcase", academy: "Punjab Hockey League", sport: "Hockey", city: "Chandigarh", date: "Apr 18, 2026", fee: 0, spots: 40, tag: "Scouted" },
  { id: "t-6", title: "Tennis Academy Open Day", academy: "Krish Tennis Centre", sport: "Tennis", city: "Pune", date: "Apr 24, 2026", fee: 0, spots: 28, tag: "Open" },
];
