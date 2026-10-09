package com.khelgrid.app.data.model

enum class UserPlan {
    FREE, PRO
}

enum class UserRole {
    ATHLETE, ORGANIZER
}

data class SportSkillLog(
    val id: String,
    val date: String,
    val focus: String,
    val score: Int,
    val minutes: Int,
    val intensity: String,
    val athleteNote: String
)

data class AthleteProfile(
    val name: String,
    val sport: String,
    val location: String,
    val headline: String,
    val competitionLevel: String,
    val verifiedHighlights: List<String>
)

data class UserAuthState(
    val name: String = "Arjun Mehta",
    val sport: String = "Cricket",
    val location: String = "Bengaluru",
    val plan: UserPlan = UserPlan.FREE,
    val wallet: Int = 150,
    val applications: List<String> = emptyList(),
    val paidApplications: List<String> = emptyList(),
    val boostedTrials: List<String> = listOf("t-3"),
    val sportsCVUnlocked: Boolean = false,
    val role: UserRole = UserRole.ATHLETE,
    val referralCode: String = "ARJUN100",
    val successfulReferrals: Int = 2,
    val referralRewards: Int = 200,
    val referralInvitesSent: Int = 4,
    val sportSkillLogs: List<SportSkillLog> = listOf(
        SportSkillLog("ssl-1", "2026-03-06", "Bowling accuracy", 74, 45, "Moderate", "Line and length felt inconsistent after the second spell."),
        SportSkillLog("ssl-2", "2026-03-09", "Batting footwork", 82, 50, "Hard", "Front-foot movement felt sharper against pace."),
        SportSkillLog("ssl-3", "2026-03-12", "Bowling accuracy", 78, 40, "Hard", "Target practice helped me hit a fuller length more often."),
        SportSkillLog("ssl-4", "2026-03-14", "Mobility and recovery", 88, 25, "Easy", "Hips and ankles felt looser after the session."),
        SportSkillLog("ssl-5", "2026-03-16", "Batting footwork", 85, 48, "Hard", "Balanced well through most of the drill set.")
    )
) {
    val athleteProfile: AthleteProfile
        get() = AthleteProfile(
            name = name,
            sport = sport,
            location = location,
            headline = "Right-arm Fast Bowler & Middle-order Batter",
            competitionLevel = "U-19 State Squad",
            verifiedHighlights = listOf(
                "5/24 vs Capital Cricket Academy · Inter-District Trophy 2025",
                "Yo-Yo IR1 Fitness Benchmark: 18.2",
                "Coach reference: Arjun Mehta · Level 2 BCCI Certified"
            )
        )

    val freeLimit: Int = 2

    val remainingFree: Int
        get() = maxOf(0, freeLimit - applications.count { it !in paidApplications })

    fun canApply(trialId: String): Boolean {
        if (trialId in applications) return true
        if (plan == UserPlan.PRO) return true
        return remainingFree > 0
    }
}
