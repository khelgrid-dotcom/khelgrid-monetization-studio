package com.khelgrid.app.data.repository

import com.khelgrid.app.data.model.*

object SportsRepository {

    val trials = listOf(
        Trial("t-1", "U-19 Cricket Selection Camp", "Capital Cricket Academy", "Cricket", "Delhi", "Mar 14, 2026", 0, 32, "Open"),
        Trial("t-2", "Pro Football Combine 2026", "Mumbai United FC", "Football", "Mumbai", "Mar 21, 2026", 0, 60, "Scouted"),
        Trial("t-3", "Elite Badminton Pathway", "Pullela Gopichand Academy", "Badminton", "Hyderabad", "Apr 02, 2026", 0, 24, "Premium"),
        Trial("t-4", "State Athletics Trials", "Sports Authority of Karnataka", "Athletics", "Bengaluru", "Apr 10, 2026", 0, 120, "Official"),
        Trial("t-5", "Junior Hockey Showcase", "Punjab Hockey League", "Hockey", "Chandigarh", "Apr 18, 2026", 0, 40, "Scouted"),
        Trial("t-6", "Tennis Academy Open Day", "Krish Tennis Centre", "Tennis", "Pune", "Apr 24, 2026", 0, 28, "Open"),
        Trial("t-7", "Ranji Trophy Net Trials", "Karnataka State Cricket Assoc.", "Cricket", "Bengaluru", "May 02, 2026", 250, 18, "Elite"),
        Trial("t-8", "ISL Youth Scout Day", "Bengaluru FC Academy", "Football", "Bengaluru", "May 08, 2026", 0, 80, "Scouted"),
        Trial("t-9", "Women's Football Combine", "Gokulam Kerala FC", "Football", "Delhi", "May 15, 2026", 0, 45, "Open"),
        Trial("t-10", "Khelo India Badminton Camp", "Prakash Padukone Academy", "Badminton", "Bengaluru", "May 22, 2026", 100, 30, "Official"),
        Trial("t-11", "National Sprint Trials", "SAI Patiala", "Athletics", "Delhi", "Jun 01, 2026", 0, 200, "Official"),
        Trial("t-12", "Sub-Junior Hockey Combine", "Odisha Hockey Promotion", "Hockey", "Mumbai", "Jun 08, 2026", 0, 50, "Open"),
        Trial("t-13", "AITA Tennis Talent Hunt", "Maharashtra Tennis Assoc.", "Tennis", "Mumbai", "Jun 14, 2026", 150, 36, "Premium"),
        Trial("t-14", "MI Paltan Cricket Trials", "Mumbai Indians Academy", "Cricket", "Mumbai", "Jun 20, 2026", 0, 60, "Premium"),
        Trial("t-15", "Chandigarh Sprint League", "Punjab Athletics Federation", "Athletics", "Chandigarh", "Jun 27, 2026", 0, 90, "Open"),
        Trial("t-16", "Pune Football Open", "Pune City FC", "Football", "Pune", "Jul 03, 2026", 0, 55, "Open"),
        Trial("t-17", "Hyderabad Tennis Selections", "Sania Mirza Tennis Academy", "Tennis", "Hyderabad", "Jul 10, 2026", 200, 24, "Elite"),
        Trial("t-18", "Hockey India Junior Camp", "Hockey India Bengaluru", "Hockey", "Bengaluru", "Jul 18, 2026", 0, 48, "Official")
    )

    val venues = listOf(
        Venue("v1", "FerroHub Sports | Millers", "Vasanth Nagar", "Bengaluru", 2.4, 4.25, 4, listOf("Pickleball", "Box Cricket"), 800, featured = true, image = "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=70"),
        Venue("v2", "Depot18 - Sports", "Jayamahal Palace Road", "Bengaluru", 2.8, 4.63, 16, listOf("Football", "Cricket"), 1200, featured = true, image = "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=600&q=70"),
        Venue("v3", "Wellness Sports Inc", "Sampangi Rama Nagar", "Bengaluru", 0.6, 4.5, 28, listOf("Swimming"), 600, image = "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=70"),
        Venue("v4", "Smashers Arena", "Indiranagar", "Bengaluru", 5.1, 4.7, 122, listOf("Badminton", "Table Tennis"), 450, image = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=70"),
        Venue("v5", "Turf Town Andheri", "Andheri West", "Mumbai", 3.2, 4.6, 210, listOf("Football", "Cricket"), 1500, featured = true, image = "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=70"),
        Venue("v6", "Hauz Khas Sports Complex", "Hauz Khas", "Delhi", 4.0, 4.4, 89, listOf("Tennis", "Basketball"), 700, image = "https://images.unsplash.com/photo-1542144612-1b3641ec3459?auto=format&fit=crop&w=600&q=70"),
        Venue("v7", "Padmavati Indoor Arena", "Madhapur", "Hyderabad", 2.1, 4.55, 64, listOf("Badminton", "Pickleball"), 550, image = "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=70"),
        Venue("v8", "Pune Box Cricket Hub", "Baner", "Pune", 6.4, 4.3, 41, listOf("Box Cricket"), 900, image = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=70"),
        Venue("v9", "Marina Aquatic Centre", "Adyar", "Chennai", 3.0, 4.65, 73, listOf("Swimming", "Volleyball"), 500, image = "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=70"),
        Venue("v10", "Sector 17 Arena", "Sector 17", "Chandigarh", 1.5, 4.5, 35, listOf("Football", "Tennis"), 850, featured = true, image = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=70")
    )

    val coachingPrograms = listOf(
        CoachingProgram("c1", "Junior Cricket Coaching", "Coach Arjun Mehta", "Cricket", "Bengaluru", "Koramangala", "Beginner", 3500, 4.7, "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c2", "Pro Badminton Academy", "Coach Priya Nair", "Badminton", "Hyderabad", "Madhapur", "Advanced", 6500, 4.9, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c3", "Beginner Tennis Bootcamp", "Coach Rohan Iyer", "Tennis", "Mumbai", "Bandra", "Beginner", 4200, 4.6, "https://images.unsplash.com/photo-1542144612-1b3641ec3459?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c4", "Football Skills Lab", "Coach Vikram Singh", "Football", "Delhi", "Dwarka", "Intermediate", 3800, 4.5, "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c5", "All Levels Swim School", "Coach Anjali Rao", "Swimming", "Chennai", "Adyar", "All Levels", 5000, 4.8, "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c6", "Pickleball Starter Pack", "Coach Daniel Thomas", "Pickleball", "Bengaluru", "Indiranagar", "Beginner", 2800, 4.4, "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c7", "Basketball Elite Squad", "Coach Kunal Verma", "Basketball", "Pune", "Aundh", "Advanced", 5500, 4.7, "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=70"),
        CoachingProgram("c8", "Table Tennis Pro Path", "Coach Meera Joshi", "Table Tennis", "Chandigarh", "Sector 22", "Intermediate", 3200, 4.5, "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=600&q=70")
    )

    val events = listOf(
        SportEvent("e1", "Sunday Pickleball Open", "Pickleball", "Bengaluru", "FerroHub Sports", "Sun, Jun 14", "8:00 AM", 499, 12, "Doubles · Round Robin", "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=70"),
        SportEvent("e2", "Corporate Cricket Cup", "Box Cricket", "Mumbai", "Turf Town Andheri", "Sat, Jun 20", "5:00 PM", 1500, 4, "Teams of 6", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=70"),
        SportEvent("e3", "City Badminton League · Wk 3", "Badminton", "Hyderabad", "Padmavati Indoor", "Fri, Jun 12", "7:30 PM", 350, 8, "Mixed Doubles", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=70"),
        SportEvent("e4", "5-a-Side Football Showdown", "Football", "Delhi", "Hauz Khas Sports", "Sun, Jun 21", "6:00 AM", 800, 2, "Single Elim", "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=70"),
        SportEvent("e5", "Pune Tennis Knockout", "Tennis", "Pune", "Aundh Sports Club", "Sat, Jun 27", "9:00 AM", 600, 6, "Singles · Best of 3", "https://images.unsplash.com/photo-1542144612-1b3641ec3459?auto=format&fit=crop&w=600&q=70"),
        SportEvent("e6", "Aqua Sprint Meet", "Swimming", "Chennai", "Marina Aquatic", "Sun, Jul 05", "7:00 AM", 450, 22, "50m / 100m heats", "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=70")
    )

    val games = listOf(
        Game("g1", "Pickleball", "Bengaluru", "FerroHub Sports", "Tue, Jun 10", "7:00 PM", "Intermediate", "Rahul S.", 3, 4, 200),
        Game("g2", "Football", "Mumbai", "Turf Town Andheri", "Wed, Jun 11", "8:30 PM", "Beginner", "Aakash M.", 8, 12, 250),
        Game("g3", "Badminton", "Hyderabad", "Padmavati Indoor", "Tue, Jun 10", "6:30 PM", "Advanced", "Sneha K.", 3, 4, 150),
        Game("g4", "Cricket", "Delhi", "Hauz Khas Sports", "Sat, Jun 14", "5:00 AM", "Intermediate", "Vikram P.", 14, 22, 180),
        Game("g5", "Tennis", "Pune", "Aundh Sports Club", "Thu, Jun 12", "6:00 PM", "Intermediate", "Neha R.", 1, 4, 220),
        Game("g6", "Box Cricket", "Bengaluru", "Smashers Arena", "Fri, Jun 13", "9:00 PM", "Beginner", "Karan D.", 6, 10, 300)
    )

    val matchupAthletes = listOf(
        MatchupAthlete("ma-1", "Sana Kapoor", "Cricket", "Intermediate", "Bengaluru", "Weeknights after 7 PM", 96, "Top-order batter looking for regular nets and weekend games."),
        MatchupAthlete("ma-2", "Rohan Das", "Cricket", "Intermediate", "Bengaluru", "Saturday mornings", 91, "All-rounder who prefers competitive but friendly matches."),
        MatchupAthlete("ma-3", "Meera Shah", "Cricket", "Beginner", "Bengaluru", "Sunday mornings", 88, "New to organised games and keen to build consistency."),
        MatchupAthlete("ma-4", "Kabir Malhotra", "Football", "Intermediate", "Mumbai", "Friday evenings", 94, "Box-to-box midfielder looking for a reliable five-a-side group."),
        MatchupAthlete("ma-5", "Ishita Menon", "Badminton", "Advanced", "Hyderabad", "Tuesday and Thursday evenings", 97, "Singles player open to doubles rotation and skill-balanced games."),
        MatchupAthlete("ma-6", "Nikhil Jain", "Tennis", "Intermediate", "Pune", "Weekend mornings", 93, "Baseline player who enjoys structured sets and post-game practice."),
        MatchupAthlete("ma-7", "Aarav Singh", "Cricket", "Advanced", "Delhi", "Sunday afternoons", 90, "Fast bowler looking for a regular competitive circle.")
    )

    val sportsCategories = listOf(
        SportCategory("cricket", "Cricket", "Ranji, IPL pathways & U-19 trials", "Elite", "U-12 to Pro", "🏏", listOf("BCCI scouted trials", "Ranji Trophy net sessions", "IPL franchise feeder camps")),
        SportCategory("football", "Football", "ISL & I-League scout days", "Elite", "U-13 to U-23", "⚽", listOf("ISL combine pathways", "AIFF-licensed academies", "Goa & Kerala showcase weeks")),
        SportCategory("badminton", "Badminton", "Gopichand, Padukone & Khelo India", "Elite", "U-11 to Senior", "🏸", listOf("State-rank entry routes", "BAI-recognised camps", "Doubles pairing trials")),
        SportCategory("athletics", "Athletics", "Sprint, throws and long-distance trials", "Elite", "U-14 to Senior", "🏃", listOf("SAI Patiala & Bengaluru centres", "AFI selection routes", "Para-athletics pathways")),
        SportCategory("hockey", "Hockey", "Odisha, Punjab & sub-junior camps", "Elite", "U-14 to Senior", "🏑", listOf("Hockey India sub-junior camps", "Punjab & Odisha promotion", "Goalkeeper-only trials")),
        SportCategory("tennis", "Tennis", "AITA ranked events & academy days", "Elite", "U-10 to Pro", "🎾", listOf("AITA-rated tournaments", "Sania Mirza & Krish centres", "Wildcards into nationals"))
    )

    val tools = listOf(
        SportsTool("trial-readiness-score", "Trial Readiness Score", "Calculator", "Get a 0-100 readiness rating before your next trial based on training frequency, sleep and recent PRs."),
        SportsTool("calorie-needs-athlete", "Athlete Calorie Needs", "Calculator", "Get a daily calorie target tuned for your sport and training intensity."),
        SportsTool("vo2-max-estimator", "VO2 Max Estimator", "Estimator", "Quick aerobic fitness estimate from a 12-minute run distance.")
    )
}
