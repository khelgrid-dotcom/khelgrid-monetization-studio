package com.khelgrid.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khelgrid.app.data.model.*
import com.khelgrid.app.data.repository.SportsRepository
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.components.BoostModalDialog
import com.khelgrid.app.ui.components.CheckoutModalDialog
import com.khelgrid.app.ui.components.VerificationAgentDialog
import com.khelgrid.app.ui.components.VerificationTarget
import com.khelgrid.app.ui.theme.*

@Composable
fun TrialsSearchScreen(
    userState: UserAuthState,
    initialSport: String = "All Sports",
    onShowMessage: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedSport by remember { mutableStateOf(if (initialSport.isNotBlank() && initialSport in SPORTS_LIST) initialSport else "All Sports") }
    var selectedCity by remember { mutableStateOf("All Locations") }
    var freeOnly by remember { mutableStateOf(false) }
    var sortKey by remember { mutableStateOf("Soonest") }

    var checkoutTrial by remember { mutableStateOf<Trial?>(null) }
    var boostTrialTarget by remember { mutableStateOf<Trial?>(null) }
    var verificationTarget by remember { mutableStateOf<VerificationTarget?>(null) }

    // Filter & Sort
    val filteredTrials = remember(searchQuery, selectedSport, selectedCity, freeOnly, sortKey, userState.boostedTrials) {
        val q = searchQuery.trim().lowercase()
        val list = SportsRepository.trials.filter { trial ->
            if (selectedSport != "All Sports" && trial.sport != selectedSport) return@filter false
            if (selectedCity != "All Locations" && trial.city != selectedCity) return@filter false
            if (freeOnly && trial.fee > 0) return@filter false
            if (q.isNotEmpty()) {
                val fullText = "${trial.title} ${trial.academy} ${trial.sport} ${trial.city} ${trial.tag}".lowercase()
                if (!fullText.contains(q)) return@filter false
            }
            true
        }

        val sorted = when (sortKey) {
            "Most spots" -> list.sortedByDescending { it.spots }
            "Lowest fee" -> list.sortedBy { it.fee }
            else -> list // naturally ordered by date
        }

        val boosted = sorted.filter { it.id in userState.boostedTrials }
        val regular = sorted.filter { it.id !in userState.boostedTrials }
        boosted + regular
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(KhelGridBg),
        contentPadding = PaddingValues(bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Search header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Text(
                    text = "Trials & Selection Camps",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                Text(
                    text = if (userState.role == UserRole.ORGANIZER)
                        "Organizer View: Boost your academy's trials to reach 86k+ athletes."
                    else
                        "Apply to verified trials across India. Free tier includes ${userState.remainingFree} free applications.",
                    fontSize = 12.sp,
                    color = TextSecondary
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Search Box
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = KhelGridCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Search, contentDescription = "Search", tint = TextSecondary, modifier = Modifier.size(18.dp))
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("Filter trials by name, academy, keywords...", fontSize = 13.sp, color = TextMuted) },
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color.Transparent,
                                unfocusedBorderColor = Color.Transparent,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            ),
                            singleLine = true
                        )
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextSecondary, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }
        }

        // Sport filter chips
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(SPORTS_LIST) { sport ->
                    FilterChip(
                        selected = selectedSport == sport,
                        onClick = { selectedSport = sport },
                        label = { Text(sport, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = KhelGridPrimary,
                            selectedLabelColor = Color.White,
                            containerColor = KhelGridSurface,
                            labelColor = TextSecondary
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = selectedSport == sport,
                            borderColor = KhelGridCardBorder,
                            selectedBorderColor = KhelGridPrimaryLight
                        )
                    )
                }
            }
        }

        // City filter chips
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(CITIES_LIST) { city ->
                    FilterChip(
                        selected = selectedCity == city,
                        onClick = { selectedCity = city },
                        label = { Text(city, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = KhelGridSecondary,
                            selectedLabelColor = Color.White,
                            containerColor = KhelGridSurface,
                            labelColor = TextSecondary
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = selectedCity == city,
                            borderColor = KhelGridCardBorder,
                            selectedBorderColor = KhelGridSecondary
                        )
                    )
                }
            }
        }

        // Controls bar (Free only + Sort)
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Free only chip
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (freeOnly) KhelGridGreen.copy(alpha = 0.2f) else KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (freeOnly) KhelGridGreen else KhelGridCardBorder
                    ),
                    modifier = Modifier.clickable { freeOnly = !freeOnly }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = "Free Entry Only",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (freeOnly) KhelGridGreen else TextSecondary
                        )
                    }
                }

                // Sort pills
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Soonest", "Most spots", "Lowest fee").forEach { sort ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (sortKey == sort) KhelGridPrimary.copy(alpha = 0.2f) else KhelGridSurface,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (sortKey == sort) KhelGridPrimary else KhelGridCardBorder
                            ),
                            modifier = Modifier.clickable { sortKey = sort }
                        ) {
                            Text(
                                text = sort,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = if (sortKey == sort) KhelGridPrimaryLight else TextSecondary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                            )
                        }
                    }
                }
            }
        }

        // Results count
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${filteredTrials.size} Trials Available",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = TextPrimary
                )

                if (userState.plan == UserPlan.FREE) {
                    Text(
                        text = "${userState.remainingFree} free applications left",
                        fontSize = 12.sp,
                        color = if (userState.remainingFree > 0) KhelGridGreen else KhelGridGold
                    )
                } else {
                    Text("Pro: Unlimited Applications", fontSize = 12.sp, color = KhelGridGold, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Trial cards list
        items(filteredTrials, key = { it.id }) { trial ->
            val isBoosted = trial.id in userState.boostedTrials
            val isApplied = trial.id in userState.applications

            Surface(
                shape = RoundedCornerShape(16.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isBoosted) KhelGridGold else KhelGridCardBorder
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Top tag row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (isBoosted) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = KhelGridGold.copy(alpha = 0.2f),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold)
                                ) {
                                    Text(
                                        text = "🔥 FEATURED BOOST",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = KhelGridGold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = KhelGridSurface
                            ) {
                                Text(
                                    text = trial.tag.uppercase(),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KhelGridPrimaryLight,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = KhelGridPrimary.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = trial.sport,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = KhelGridPrimaryLight,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = trial.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = TextPrimary
                    )

                    Text(
                        text = trial.academy,
                        fontSize = 13.sp,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Details row: City, Date, Spots, Fee
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("📍 ${trial.city}", fontSize = 12.sp, color = TextSecondary)
                            Text("📅 ${trial.date}", fontSize = 12.sp, color = TextSecondary)
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text("👥 ${trial.spots} spots", fontSize = 12.sp, color = TextSecondary)
                            Text(
                                text = if (trial.fee == 0) "FREE ENTRY" else "Entry: ₹${trial.fee}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (trial.fee == 0) KhelGridGreen else KhelGridGold
                            )
                        }
                    }

                    OutlinedButton(
                        onClick = { verificationTarget = VerificationTarget.opportunity(trial) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = KhelGridSecondary),
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridSecondary.copy(alpha = 0.7f))
                    ) {
                        Icon(Icons.Default.VerifiedUser, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Verify with community agent", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Action buttons (Apply / Boost)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Apply Button
                        if (isApplied) {
                            Button(
                                onClick = { onShowMessage("You have already applied for ${trial.title}") },
                                colors = ButtonDefaults.buttonColors(containerColor = KhelGridGreen.copy(alpha = 0.2f)),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Check, contentDescription = "Applied", tint = KhelGridGreen, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Applied Successfully", color = KhelGridGreen, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        } else {
                            Button(
                                onClick = {
                                    if (userState.canApply(trial.id)) {
                                        UserSessionRepository.applyToTrial(trial.id)
                                        onShowMessage("Applied to ${trial.title}!")
                                    } else {
                                        checkoutTrial = trial
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                val buttonLabel = when {
                                    userState.plan == UserPlan.PRO -> "Apply (Pro Free)"
                                    userState.remainingFree > 0 -> "Apply (${userState.remainingFree} free left)"
                                    else -> "Apply (Unlock ₹49)"
                                }
                                Text(buttonLabel, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }

                        // Organizer Boost Button
                        if (userState.role == UserRole.ORGANIZER) {
                            OutlinedButton(
                                onClick = { boostTrialTarget = trial },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = KhelGridGold),
                                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold)
                            ) {
                                Icon(Icons.Default.LocalFireDepartment, contentDescription = "Boost", tint = KhelGridGold, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Boost", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }

    // Checkout Modal
    checkoutTrial?.let { trial ->
        CheckoutModalDialog(
            trial = trial,
            userState = userState,
            onDismiss = { checkoutTrial = null },
            onSuccess = { msg ->
                checkoutTrial = null
                onShowMessage(msg)
            }
        )
    }

    // Boost Modal
    boostTrialTarget?.let { trial ->
        BoostModalDialog(
            trial = trial,
            userState = userState,
            onDismiss = { boostTrialTarget = null },
            onSuccess = { msg ->
                boostTrialTarget = null
                onShowMessage(msg)
            }
        )
    }

    verificationTarget?.let { target ->
        VerificationAgentDialog(
            target = target,
            onDismiss = { verificationTarget = null }
        )
    }
}
