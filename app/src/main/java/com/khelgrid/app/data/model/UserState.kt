package com.khelgrid.app.data.model

enum class UserPlan {
    FREE, PRO
}

enum class UserRole {
    ATHLETE, ORGANIZER
}

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
    val role: UserRole = UserRole.ATHLETE
) {
    val freeLimit: Int = 2

    val remainingFree: Int
        get() = maxOf(0, freeLimit - applications.count { it !in paidApplications })

    fun canApply(trialId: String): Boolean {
        if (trialId in applications) return true
        if (plan == UserPlan.PRO) return true
        return remainingFree > 0
    }
}
