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
  { id: "t-7", title: "Ranji Trophy Net Trials", academy: "Karnataka State Cricket Assoc.", sport: "Cricket", city: "Bengaluru", date: "May 02, 2026", fee: 250, spots: 18, tag: "Elite" },
  { id: "t-8", title: "ISL Youth Scout Day", academy: "Bengaluru FC Academy", sport: "Football", city: "Bengaluru", date: "May 08, 2026", fee: 0, spots: 80, tag: "Scouted" },
  { id: "t-9", title: "Women's Football Combine", academy: "Gokulam Kerala FC", sport: "Football", city: "Delhi", date: "May 15, 2026", fee: 0, spots: 45, tag: "Open" },
  { id: "t-10", title: "Khelo India Badminton Camp", academy: "Prakash Padukone Academy", sport: "Badminton", city: "Bengaluru", date: "May 22, 2026", fee: 100, spots: 30, tag: "Official" },
  { id: "t-11", title: "National Sprint Trials", academy: "SAI Patiala", sport: "Athletics", city: "Delhi", date: "Jun 01, 2026", fee: 0, spots: 200, tag: "Official" },
  { id: "t-12", title: "Sub-Junior Hockey Combine", academy: "Odisha Hockey Promotion", sport: "Hockey", city: "Mumbai", date: "Jun 08, 2026", fee: 0, spots: 50, tag: "Open" },
  { id: "t-13", title: "AITA Tennis Talent Hunt", academy: "Maharashtra Tennis Assoc.", sport: "Tennis", city: "Mumbai", date: "Jun 14, 2026", fee: 150, spots: 36, tag: "Premium" },
  { id: "t-14", title: "MI Paltan Cricket Trials", academy: "Mumbai Indians Academy", sport: "Cricket", city: "Mumbai", date: "Jun 20, 2026", fee: 0, spots: 60, tag: "Premium" },
  { id: "t-15", title: "Chandigarh Sprint League", academy: "Punjab Athletics Federation", sport: "Athletics", city: "Chandigarh", date: "Jun 27, 2026", fee: 0, spots: 90, tag: "Open" },
  { id: "t-16", title: "Pune Football Open", academy: "Pune City FC", sport: "Football", city: "Pune", date: "Jul 03, 2026", fee: 0, spots: 55, tag: "Open" },
  { id: "t-17", title: "Hyderabad Tennis Selections", academy: "Sania Mirza Tennis Academy", sport: "Tennis", city: "Hyderabad", date: "Jul 10, 2026", fee: 200, spots: 24, tag: "Elite" },
  { id: "t-18", title: "Hockey India Junior Camp", academy: "Hockey India Bengaluru", sport: "Hockey", city: "Bengaluru", date: "Jul 18, 2026", fee: 0, spots: 48, tag: "Official" },
];

export const SPORTS = ["Cricket", "Football", "Badminton", "Athletics", "Hockey", "Tennis"] as const;
export const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chandigarh", "Pune"] as const;
