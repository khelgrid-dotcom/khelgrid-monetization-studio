package com.khelgrid.app.data.repository

import com.khelgrid.app.data.model.MatchupPost
import com.khelgrid.app.data.model.UserAuthState
import com.khelgrid.app.data.model.UserPlan
import com.khelgrid.app.data.model.UserRole
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

object UserSessionRepository {

    private val _userState = MutableStateFlow(
        UserAuthState(
            name = "Arjun Mehta",
            sport = "Cricket",
            location = "Bengaluru",
            plan = UserPlan.FREE,
            wallet = 150,
            applications = listOf("t-1"),
            paidApplications = emptyList(),
            boostedTrials = listOf("t-3", "t-7"),
            sportsCVUnlocked = false,
            role = UserRole.ATHLETE,
            referralCode = "ARJUN100",
            successfulReferrals = 2,
            referralRewards = 200,
            referralInvitesSent = 4
        )
    )
    val userState: StateFlow<UserAuthState> = _userState.asStateFlow()

    private val _bookedVenues = MutableStateFlow<List<String>>(emptyList())
    val bookedVenues: StateFlow<List<String>> = _bookedVenues.asStateFlow()

    private val _joinedGames = MutableStateFlow<List<String>>(listOf("g-1"))
    val joinedGames: StateFlow<List<String>> = _joinedGames.asStateFlow()

    private val _matchupPosts = MutableStateFlow<List<MatchupPost>>(emptyList())
    val matchupPosts: StateFlow<List<MatchupPost>> = _matchupPosts.asStateFlow()

    private val _matchupInvites = MutableStateFlow<List<String>>(emptyList())
    val matchupInvites: StateFlow<List<String>> = _matchupInvites.asStateFlow()

    private val _enrolledEvents = MutableStateFlow<List<String>>(emptyList())
    val enrolledEvents: StateFlow<List<String>> = _enrolledEvents.asStateFlow()

    fun applyToTrial(trialId: String): Boolean {
        val current = _userState.value
        if (trialId in current.applications) return true
        if (current.canApply(trialId)) {
            _userState.update { it.copy(applications = it.applications + trialId) }
            return true
        }
        return false
    }

    fun payForApplication(trialId: String, viaWallet: Boolean): Boolean {
        val current = _userState.value
        if (viaWallet) {
            if (current.wallet < 49) return false
            _userState.update {
                it.copy(
                    wallet = it.wallet - 49,
                    applications = if (trialId in it.applications) it.applications else it.applications + trialId,
                    paidApplications = if (trialId in it.paidApplications) it.paidApplications else it.paidApplications + trialId
                )
            }
            return true
        } else {
            // UPI payment simulated as success
            _userState.update {
                it.copy(
                    applications = if (trialId in it.applications) it.applications else it.applications + trialId,
                    paidApplications = if (trialId in it.paidApplications) it.paidApplications else it.paidApplications + trialId
                )
            }
            return true
        }
    }

    fun boostTrial(trialId: String, viaWallet: Boolean): Boolean {
        val current = _userState.value
        if (viaWallet) {
            if (current.wallet < 1500) return false
            _userState.update {
                it.copy(
                    wallet = it.wallet - 1500,
                    boostedTrials = if (trialId in it.boostedTrials) it.boostedTrials else it.boostedTrials + trialId
                )
            }
            return true
        } else {
            _userState.update {
                it.copy(
                    boostedTrials = if (trialId in it.boostedTrials) it.boostedTrials else it.boostedTrials + trialId
                )
            }
            return true
        }
    }

    fun unlockSportsCV(viaWallet: Boolean): Boolean {
        val current = _userState.value
        if (viaWallet) {
            if (current.wallet < 199) return false
            _userState.update { it.copy(wallet = it.wallet - 199, sportsCVUnlocked = true) }
            return true
        } else {
            _userState.update { it.copy(sportsCVUnlocked = true) }
            return true
        }
    }

    fun topUpWallet(amount: Int) {
        _userState.update { it.copy(wallet = it.wallet + amount) }
    }

    fun upgradeToPro() {
        _userState.update { it.copy(plan = UserPlan.PRO, sportsCVUnlocked = true) }
    }

    fun setRole(role: UserRole) {
        _userState.update { it.copy(role = role) }
    }

    fun recordReferralInvite() {
        _userState.update { it.copy(referralInvitesSent = it.referralInvitesSent + 1) }
    }

    fun bookVenue(venueId: String): Boolean {
        _bookedVenues.update { if (venueId in it) it else it + venueId }
        return true
    }

    fun joinGame(gameId: String): Boolean {
        _joinedGames.update { if (gameId in it) it else it + gameId }
        return true
    }

    fun registerEvent(eventId: String): Boolean {
        _enrolledEvents.update { if (eventId in it) it else it + eventId }
        return true
    }

    fun publishMatchupPost(post: MatchupPost) {
        _matchupPosts.update { posts -> posts + post.copy(id = "mp-${posts.size + 1}") }
    }

    fun sendMatchupInvite(athleteId: String) {
        _matchupInvites.update { invites -> if (athleteId in invites) invites else invites + athleteId }
    }
}
