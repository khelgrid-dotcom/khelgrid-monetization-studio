package com.khelgrid.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.khelgrid.app.data.model.AthleteProfile
import com.khelgrid.app.data.model.MatchupAthlete
import com.khelgrid.app.data.model.MatchupPost
import com.khelgrid.app.data.model.SportSkillLog
import com.khelgrid.app.data.model.Trial
import com.khelgrid.app.data.model.UserAuthState
import com.khelgrid.app.data.model.Venue
import com.khelgrid.app.data.model.UserPlan
import com.khelgrid.app.data.model.UserRole
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.theme.*

@Composable
fun KhelGridTopBar(
    userState: UserAuthState,
    onTopUpClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = KhelGridSurface,
        modifier = modifier.fillMaxWidth(),
        tonalElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Brand & Tag
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(KhelGridPrimary, Color(0xFF6366F1))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.EmojiEvents,
                        contentDescription = "KhelGrid",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = "KhelGrid",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )

                        if (userState.plan == UserPlan.PRO) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(KhelGridGold.copy(alpha = 0.2f))
                                    .border(1.dp, KhelGridGold.copy(alpha = 0.5f), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "PRO",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KhelGridGold
                                )
                            }
                        }
                    }

                    Text(
                        text = if (userState.role == UserRole.ATHLETE) "Athlete Mode" else "Academy / Scout Mode",
                        fontSize = 11.sp,
                        color = TextSecondary
                    )
                }
            }

            // Wallet & Role Toggle
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Wallet chip
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = KhelGridCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                    modifier = Modifier.clickable { onTopUpClick() }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AccountBalanceWallet,
                            contentDescription = "Wallet",
                            tint = KhelGridGreen,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "₹${userState.wallet}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                    }
                }

                // Role chip toggle
                Surface(
                    shape = CircleShape,
                    color = if (userState.role == UserRole.ORGANIZER) KhelGridGold.copy(alpha = 0.2f) else KhelGridCard,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (userState.role == UserRole.ORGANIZER) KhelGridGold else KhelGridCardBorder
                    ),
                    modifier = Modifier.clickable {
                        val next = if (userState.role == UserRole.ATHLETE) UserRole.ORGANIZER else UserRole.ATHLETE
                        UserSessionRepository.setRole(next)
                    }
                ) {
                    Box(
                        modifier = Modifier.padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (userState.role == UserRole.ORGANIZER) Icons.Default.LocalFireDepartment else Icons.Default.DirectionsRun,
                            contentDescription = "Toggle Role",
                            tint = if (userState.role == UserRole.ORGANIZER) KhelGridGold else TextSecondary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CheckoutModalDialog(
    trial: Trial,
    userState: UserAuthState,
    onDismiss: () -> Unit,
    onSuccess: (String) -> Unit
) {
    var selectedMethod by remember { mutableStateOf("wallet") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(text = "Unlock Application", fontWeight = FontWeight.Bold, color = TextPrimary)
                Text(text = trial.title, fontSize = 13.sp, color = TextSecondary)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Application Unlock Fee", fontSize = 13.sp, color = TextSecondary)
                            Text("Micropayment · Direct Scout Access", fontSize = 11.sp, color = TextMuted)
                        }
                        Text("₹49", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = KhelGridGreen)
                    }
                }

                Text("Payment Method", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)

                // Wallet option
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (selectedMethod == "wallet") KhelGridPrimary.copy(alpha = 0.15f) else KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (selectedMethod == "wallet") KhelGridPrimary else KhelGridCardBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMethod = "wallet" }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        RadioButton(
                            selected = selectedMethod == "wallet",
                            onClick = { selectedMethod = "wallet" }
                        )
                        Column {
                            Text("KhelGrid Wallet (Balance: ₹${userState.wallet})", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                            if (userState.wallet < 49) {
                                Text("Insufficient balance (Need ₹49)", fontSize = 11.sp, color = KhelGridRed)
                            } else {
                                Text("Instant 1-tap deduction", fontSize = 11.sp, color = KhelGridGreen)
                            }
                        }
                    }
                }

                // UPI option
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (selectedMethod == "upi") KhelGridPrimary.copy(alpha = 0.15f) else KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (selectedMethod == "upi") KhelGridPrimary else KhelGridCardBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMethod = "upi" }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        RadioButton(
                            selected = selectedMethod == "upi",
                            onClick = { selectedMethod = "upi" }
                        )
                        Column {
                            Text("Instant UPI / QR / NetBanking", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                            Text("GPay, PhonePe, Paytm supported", fontSize = 11.sp, color = TextSecondary)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val viaWallet = selectedMethod == "wallet"
                    val ok = UserSessionRepository.payForApplication(trial.id, viaWallet)
                    if (ok) {
                        onSuccess("Application submitted successfully for ${trial.title}")
                    }
                },
                enabled = selectedMethod != "wallet" || userState.wallet >= 49,
                colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary)
            ) {
                Text("Pay ₹49 & Apply", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = TextSecondary)
            }
        },
        containerColor = KhelGridCard
    )
}

@Composable
fun BoostModalDialog(
    trial: Trial,
    userState: UserAuthState,
    onDismiss: () -> Unit,
    onSuccess: (String) -> Unit
) {
    var selectedMethod by remember { mutableStateOf("wallet") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.LocalFireDepartment, contentDescription = "Boost", tint = KhelGridGold)
                Text(text = "Boost Trial Opportunity", fontWeight = FontWeight.Bold, color = TextPrimary)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Pin \"${trial.title}\" to the top of all search results for 7 days with a glowing Featured badge.",
                    fontSize = 13.sp,
                    color = TextSecondary
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold.copy(alpha = 0.5f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("7-Day Featured Boost", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                            Text("Est. 3.5× more scout applications", fontSize = 11.sp, color = KhelGridGold)
                        }
                        Text("₹1,500", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = KhelGridGold)
                    }
                }

                Text("Payment Method", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)

                // Wallet
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (selectedMethod == "wallet") KhelGridGold.copy(alpha = 0.15f) else KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (selectedMethod == "wallet") KhelGridGold else KhelGridCardBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMethod = "wallet" }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        RadioButton(selected = selectedMethod == "wallet", onClick = { selectedMethod = "wallet" })
                        Column {
                            Text("Wallet (₹${userState.wallet})", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                            if (userState.wallet < 1500) {
                                Text("Need ₹${1500 - userState.wallet} more", fontSize = 11.sp, color = KhelGridRed)
                            }
                        }
                    }
                }

                // UPI
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (selectedMethod == "upi") KhelGridGold.copy(alpha = 0.15f) else KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (selectedMethod == "upi") KhelGridGold else KhelGridCardBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMethod = "upi" }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        RadioButton(selected = selectedMethod == "upi", onClick = { selectedMethod = "upi" })
                        Text("Instant UPI / Corporate Card", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val viaWallet = selectedMethod == "wallet"
                    val ok = UserSessionRepository.boostTrial(trial.id, viaWallet)
                    if (ok) {
                        onSuccess("Trial successfully boosted to Featured!")
                    }
                },
                enabled = selectedMethod != "wallet" || userState.wallet >= 1500,
                colors = ButtonDefaults.buttonColors(containerColor = KhelGridGold)
            ) {
                Text("Confirm Boost (₹1,500)", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = TextSecondary) }
        },
        containerColor = KhelGridCard
    )
}

@Composable
fun WalletTopUpDialog(
    userState: UserAuthState,
    onDismiss: () -> Unit,
    onSuccess: (String) -> Unit
) {
    var topUpAmount by remember { mutableStateOf(500) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Top Up KhelGrid Wallet", fontWeight = FontWeight.Bold, color = TextPrimary)
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text(
                    text = "Current balance: ₹${userState.wallet}. Top up to seamlessly pay for trial applications, academy boosts, or booking venues.",
                    fontSize = 13.sp,
                    color = TextSecondary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(100, 500, 1500).forEach { amount ->
                        Button(
                            onClick = { topUpAmount = amount },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (topUpAmount == amount) KhelGridPrimary else KhelGridSurface
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (topUpAmount == amount) KhelGridPrimaryLight else KhelGridCardBorder
                            ),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                "₹$amount",
                                color = if (topUpAmount == amount) Color.White else TextPrimary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    UserSessionRepository.topUpWallet(topUpAmount)
                    onSuccess("Added ₹$topUpAmount to your wallet!")
                },
                colors = ButtonDefaults.buttonColors(containerColor = KhelGridGreen)
            ) {
                Text("Add ₹$topUpAmount", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Close", color = TextSecondary) }
        },
        containerColor = KhelGridCard
    )
}

enum class VerificationKind {
    OPPORTUNITY,
    VENUE
}

data class VerificationTarget(
    val kind: VerificationKind,
    val title: String,
    val provider: String,
    val category: String,
    val location: String,
    val communitySignals: List<String>,
    val officialCheck: String
) {
    companion object {
        fun opportunity(trial: Trial) = VerificationTarget(
            kind = VerificationKind.OPPORTUNITY,
            title = trial.title,
            provider = trial.academy,
            category = "${trial.sport} · ${trial.tag}",
            location = "${trial.city} · ${trial.date}",
            communitySignals = listOf(
                "No community reports are attached to this opportunity in the current directory.",
                "The listing exposes ${trial.spots} spots and ${if (trial.fee == 0) "free entry" else "a ₹${trial.fee} entry fee"} for an independent comparison.",
                "Match the ${trial.tag.lowercase()} label against the academy's own announcement before applying."
            ),
            officialCheck = "Check the academy's official page or contact its listed organizer. Match the title, date, city, fee, and application link before paying or sharing documents."
        )

        fun venue(venue: Venue) = VerificationTarget(
            kind = VerificationKind.VENUE,
            title = venue.name,
            provider = "Community venue listing",
            category = venue.sports.joinToString(" · "),
            location = "${venue.area}, ${venue.city} · ${venue.distanceKm} km away",
            communitySignals = listOf(
                "Community rating is ${venue.rating}/5 across ${venue.reviews} reviews.",
                "Community members list ${venue.sports.joinToString(", ")} as available sports.",
                "The directory shows a ₹${venue.pricePerHour}/hour rate for comparison with the venue's current quote."
            ),
            officialCheck = "Confirm the court or turf is open for your time slot through the venue's official number or booking channel. Ask them to confirm the sport, hourly rate, and cancellation terms."
        )
    }
}

@Composable
fun VerificationAgentDialog(
    target: VerificationTarget,
    onDismiss: () -> Unit
) {
    val steps = listOf("Match details", "Review community data", "Confirm officially")
    var currentStep by remember { mutableStateOf(0) }
    val completedSteps = remember { mutableStateListOf(false, false, false) }
    val isComplete = currentStep == steps.size

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = KhelGridCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 680.dp)
        ) {
            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = KhelGridSecondary)
                            Text("Community verification agent", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        }
                        Text(
                            text = if (isComplete) "Verification checklist complete" else "Step ${currentStep + 1} of ${steps.size}: ${steps[currentStep]}",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close verification agent", tint = TextSecondary)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(target.title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        Text(target.provider, fontSize = 12.sp, color = TextSecondary)
                        Text("${target.category} · ${target.location}", fontSize = 12.sp, color = KhelGridPrimaryLight)
                    }
                }

                if (!isComplete) {
                    LinearProgressIndicator(
                        progress = { (currentStep + 1).toFloat() / steps.size },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp),
                        color = KhelGridSecondary,
                        trackColor = KhelGridSurface
                    )

                    when (currentStep) {
                        0 -> VerificationStepCard(
                            icon = Icons.Default.FactCheck,
                            title = "Match the listing details",
                            detail = "Compare the details below with the opportunity or venue page you opened. Stop if the name, location, date, or price differs.",
                            checked = completedSteps[0],
                            onCheckedChange = { completedSteps[0] = it }
                        )
                        1 -> {
                            Text("Community signals", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                            target.communitySignals.forEach { signal ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = KhelGridSurface,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                                        verticalAlignment = Alignment.Top
                                    ) {
                                        Icon(Icons.Default.Groups, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(18.dp))
                                        Text(signal, fontSize = 12.sp, color = TextSecondary)
                                    }
                                }
                            }
                            VerificationStepCard(
                                icon = Icons.Default.Groups,
                                title = "Review the community evidence",
                                detail = "Use these signals as a confidence check, not as a substitute for the official source.",
                                checked = completedSteps[1],
                                onCheckedChange = { completedSteps[1] = it }
                            )
                        }
                        2 -> VerificationStepCard(
                            icon = Icons.Default.PhoneInTalk,
                            title = "Confirm through an official channel",
                            detail = target.officialCheck,
                            checked = completedSteps[2],
                            onCheckedChange = { completedSteps[2] = it }
                        )
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = KhelGridGreen.copy(alpha = 0.12f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGreen.copy(alpha = 0.5f))
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = KhelGridGreen)
                                Text("Ready to proceed", fontWeight = FontWeight.Bold, color = KhelGridGreen)
                            }
                            Text(
                                text = "You matched the listing, reviewed community data, and completed an official check. Keep a screenshot or confirmation message for your records.",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }
                    }
                    Text(
                        text = "Community data can change. Re-run this check if the price, schedule, or organizer changes.",
                        fontSize = 12.sp,
                        color = KhelGridGoldLight
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    if (currentStep > 0 && !isComplete) {
                        OutlinedButton(
                            onClick = { currentStep-- },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary),
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                        ) {
                            Text("Back")
                        }
                    }
                    Button(
                        onClick = {
                            if (isComplete) onDismiss() else currentStep++
                        },
                        enabled = isComplete || completedSteps[currentStep],
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary)
                    ) {
                        Text(if (isComplete) "Done" else if (currentStep == steps.lastIndex) "Finish check" else "Continue", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun VerificationStepCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    detail: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = if (checked) KhelGridSecondary.copy(alpha = 0.12f) else KhelGridSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, if (checked) KhelGridSecondary else KhelGridCardBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.Top) {
                Icon(icon, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(20.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)
                    Text(detail, fontSize = 12.sp, color = TextSecondary)
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(checked = checked, onCheckedChange = onCheckedChange)
                Text("I checked this", fontSize = 12.sp, color = TextPrimary)
            }
        }
    }
}

@Composable
fun PerformanceReviewAgentDialog(
    logs: List<SportSkillLog>,
    onDismiss: () -> Unit
) {
    if (logs.isEmpty()) {
        Dialog(onDismissRequest = onDismiss) {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(22.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Icon(Icons.Default.Insights, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(28.dp))
                    Text("Your coach needs a first session", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                    Text("Add a SportSkillLog entry after your next workout with a focus area, score, duration, intensity, and one honest note. Then come back for personalized feedback.", fontSize = 13.sp, color = TextSecondary)
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Close", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        return
    }

    val recentLogs = logs.sortedByDescending { it.date }
    val averageScore = recentLogs.map { it.score }.average().toInt()
    val averageMinutes = recentLogs.map { it.minutes }.average().toInt()
    val strongestLog = recentLogs.maxByOrNull { it.score } ?: recentLogs.first()
    val growthLog = recentLogs.minByOrNull { it.score } ?: recentLogs.first()
    val hardSessions = recentLogs.count { it.intensity.equals("Hard", ignoreCase = true) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = KhelGridCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 720.dp)
        ) {
            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.Insights, contentDescription = null, tint = KhelGridPrimaryLight)
                            Text("SportSkillLog coach", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        }
                        Text("Constructive feedback from your recent training logs", fontSize = 12.sp, color = TextSecondary)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close performance coach", tint = TextSecondary)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        PerformanceMetric(value = "$averageScore/100", label = "Average score", color = KhelGridPrimaryLight)
                        PerformanceMetric(value = "${recentLogs.size}", label = "Sessions logged", color = KhelGridSecondary)
                        PerformanceMetric(value = "${averageMinutes}m", label = "Avg. duration", color = KhelGridGold)
                    }
                }

                PerformanceInsight(
                    icon = Icons.Default.EmojiEvents,
                    label = "Your strength",
                    title = strongestLog.focus,
                    detail = "You scored ${strongestLog.score}/100 here. ${strongestLog.athleteNote} Keep this as a reliable part of your weekly routine.",
                    accent = KhelGridGreen
                )

                PerformanceInsight(
                    icon = Icons.Default.TrendingUp,
                    label = "Best growth opportunity",
                    title = growthLog.focus,
                    detail = "This is your lowest logged score at ${growthLog.score}/100. Start with one focused adjustment instead of changing everything at once.",
                    accent = KhelGridGold
                )

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridPrimary.copy(alpha = 0.12f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridPrimary.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = KhelGridPrimaryLight)
                            Text("Your 7-day focus", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        }
                        PerformancePlanRow("2 focused ${growthLog.focus} sessions", "Keep them to 30–45 minutes and record one specific cue you worked on.")
                        PerformancePlanRow("1 easy recovery day", "Your log shows $hardSessions hard session${if (hardSessions == 1) "" else "s"}; protect quality by giving your body room to adapt.")
                        PerformancePlanRow("Re-log the same metric", "Compare like with like next week so your progress is easier to see.")
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(Icons.Default.EditNote, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(20.dp))
                        Column {
                            Text("Make your next log more useful", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)
                            Text("Note what felt difficult, what cue helped, and how recovered you felt the next morning. That context makes the next review more precise.", fontSize = 12.sp, color = TextSecondary)
                        }
                    }
                }

                Text(
                    "Scores are directional coaching feedback, not a medical assessment. Stop and seek qualified help if training causes pain or unusual symptoms.",
                    fontSize = 11.sp,
                    color = TextMuted
                )

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Got it", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun PerformanceMetric(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = color)
        Text(label, fontSize = 10.sp, color = TextSecondary)
    }
}

@Composable
private fun PerformanceInsight(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    title: String,
    detail: String,
    accent: Color
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = KhelGridSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, accent.copy(alpha = 0.55f))
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(icon, contentDescription = null, tint = accent, modifier = Modifier.size(21.dp))
            Column {
                Text(label.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = accent)
                Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                Text(detail, fontSize = 12.sp, color = TextSecondary)
            }
        }
    }
}

@Composable
private fun PerformancePlanRow(title: String, detail: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(9.dp), verticalAlignment = Alignment.Top) {
        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(17.dp))
        Column {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = TextPrimary)
            Text(detail, fontSize = 12.sp, color = TextSecondary)
        }
    }
}

@Composable
fun CareerAdviceAgentDialog(
    profile: AthleteProfile,
    fitnessMetrics: List<SportSkillLog>,
    onDismiss: () -> Unit
) {
    if (fitnessMetrics.isEmpty()) {
        Dialog(onDismissRequest = onDismiss) {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Icon(Icons.Default.Explore, contentDescription = null, tint = KhelGridGold, modifier = Modifier.size(28.dp))
                    Text("Build your first career signal", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                    Text("Log one training session before asking for strategic advice. Your coach will use the result alongside your ${profile.sport} profile to suggest realistic next steps.", fontSize = 13.sp, color = TextSecondary)
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Close", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        return
    }

    val orderedMetrics = fitnessMetrics.sortedByDescending { it.date }
    val averageScore = orderedMetrics.map { it.score }.average().toInt()
    val latestMetric = orderedMetrics.first()
    val priorMetric = orderedMetrics.getOrNull(1) ?: latestMetric
    val scoreDelta = latestMetric.score - priorMetric.score
    val strongestMetric = orderedMetrics.maxByOrNull { it.score } ?: latestMetric
    val growthMetric = orderedMetrics.minByOrNull { it.score } ?: latestMetric
    val consistency = orderedMetrics.count { it.score >= averageScore }
    val readiness = when {
        averageScore >= 85 -> "Ready to target selective opportunities"
        averageScore >= 75 -> "Build evidence while targeting development opportunities"
        else -> "Strengthen fundamentals before prioritising selection events"
    }
    val pathway = when {
        averageScore >= 85 && scoreDelta >= 0 -> "Selection trials and academy showcases"
        averageScore >= 75 -> "Regional academy pathway with measured trial exposure"
        else -> "Structured academy development before high-stakes trials"
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = KhelGridCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 740.dp)
        ) {
            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.Explore, contentDescription = null, tint = KhelGridGold)
                            Text("Career strategy agent", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        }
                        Text("A practical next-step view of your athlete profile", fontSize = 12.sp, color = TextSecondary)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close career strategy", tint = TextSecondary)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                        Text(profile.name, fontWeight = FontWeight.Bold, fontSize = 17.sp, color = TextPrimary)
                        Text(profile.headline, fontSize = 13.sp, color = TextSecondary)
                        Text("${profile.sport} · ${profile.competitionLevel} · ${profile.location}", fontSize = 12.sp, color = KhelGridGoldLight)
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    PerformanceMetric(value = "$averageScore/100", label = "Fitness signal", color = KhelGridPrimaryLight)
                    PerformanceMetric(value = if (scoreDelta >= 0) "+$scoreDelta" else "$scoreDelta", label = "Latest trend", color = if (scoreDelta >= 0) KhelGridGreen else KhelGridGold)
                    PerformanceMetric(value = "$consistency/${orderedMetrics.size}", label = "Consistent logs", color = KhelGridSecondary)
                }

                CareerAdviceSection(
                    icon = Icons.Default.Flag,
                    label = "Strategic direction",
                    title = pathway,
                    detail = "$readiness. Your strongest signal is ${strongestMetric.focus} at ${strongestMetric.score}/100, so use it to support your next application story.",
                    accent = KhelGridGold
                )

                CareerAdviceSection(
                    icon = Icons.Default.Tune,
                    label = "Priority gap",
                    title = growthMetric.focus,
                    detail = "Your lowest logged signal is ${growthMetric.score}/100. Improve this before relying on it in a trial, profile headline, or coach conversation.",
                    accent = KhelGridSecondary
                )

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridPrimary.copy(alpha = 0.12f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridPrimary.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = KhelGridPrimaryLight)
                            Text("Your next three moves", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        }
                        CareerAdviceAction("Close the gap", "Schedule two targeted ${growthMetric.focus} sessions in the next seven days.")
                        CareerAdviceAction("Package your proof", "Lead with your ${profile.verifiedHighlights.firstOrNull() ?: "strongest verified result"} when speaking to an academy or scout.")
                        CareerAdviceAction("Choose the right exposure", "Prioritise ${profile.location} opportunities that match your ${profile.sport} level, then review your metrics again before moving up.")
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = KhelGridSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Profile evidence to keep current", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)
                        profile.verifiedHighlights.forEach { highlight ->
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = KhelGridGreen, modifier = Modifier.size(16.dp))
                                Text(highlight, fontSize = 12.sp, color = TextSecondary)
                            }
                        }
                    }
                }

                Text(
                    "This is strategic guidance from your saved profile and fitness logs, not a selection guarantee or medical assessment. Revisit it as your evidence changes.",
                    fontSize = 11.sp,
                    color = TextMuted
                )

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Save the plan", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun CareerAdviceSection(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    title: String,
    detail: String,
    accent: Color
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = KhelGridSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, accent.copy(alpha = 0.55f))
    ) {
        Row(modifier = Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.Top) {
            Icon(icon, contentDescription = null, tint = accent, modifier = Modifier.size(21.dp))
            Column {
                Text(label.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = accent)
                Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                Text(detail, fontSize = 12.sp, color = TextSecondary)
            }
        }
    }
}

@Composable
private fun CareerAdviceAction(title: String, detail: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(9.dp), verticalAlignment = Alignment.Top) {
        Icon(Icons.Default.ArrowForward, contentDescription = null, tint = KhelGridSecondary, modifier = Modifier.size(17.dp))
        Column {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = TextPrimary)
            Text(detail, fontSize = 12.sp, color = TextSecondary)
        }
    }
}

@Composable
fun MatchupPostAgentDialog(
    initialSport: String,
    initialCity: String,
    athletes: List<MatchupAthlete>,
    onInvite: (MatchupAthlete) -> Unit,
    onPublish: (MatchupPost) -> Unit,
    onDismiss: () -> Unit
) {
    val sports = athletes.map { it.sport }.distinct().sorted()
    val steps = listOf("Game details", "Find athletes", "Publish")
    var currentStep by remember { mutableStateOf(0) }
    var selectedSport by remember { mutableStateOf(initialSport.ifBlank { sports.firstOrNull() ?: "Cricket" }) }
    var selectedSkill by remember { mutableStateOf("Intermediate") }
    var selectedCity by remember { mutableStateOf(initialCity) }
    var date by remember { mutableStateOf("This Saturday") }
    var time by remember { mutableStateOf("7:00 PM") }
    var venue by remember { mutableStateOf("") }
    var format by remember { mutableStateOf("Casual game") }
    var spotsNeeded by remember { mutableStateOf(2) }
    var message by remember { mutableStateOf("") }
    val invitedAthletes = remember { mutableStateListOf<String>() }
    val matchingAthletes = athletes.filter { athlete ->
        athlete.sport == selectedSport &&
            athlete.city.equals(selectedCity, ignoreCase = true) &&
            (athlete.skillLevel == selectedSkill || selectedSkill == "Any level")
    }
    val defaultMessage = "Looking for $spotsNeeded ${selectedSport.lowercase()} player${if (spotsNeeded == 1) "" else "s"} for a ${format.lowercase()} at $venue."

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = KhelGridCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 740.dp)
        ) {
            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.GroupAdd, contentDescription = null, tint = KhelGridSecondary)
                            Text("Create a MatchupPost", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        }
                        Text("Find the right players for one good game", fontSize = 12.sp, color = TextSecondary)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close matchup post", tint = TextSecondary)
                    }
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    steps.forEachIndexed { index, label ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (index <= currentStep) KhelGridSecondary.copy(alpha = 0.2f) else KhelGridSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (index <= currentStep) KhelGridSecondary else KhelGridCardBorder),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = "${index + 1}. $label",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (index <= currentStep) KhelGridSecondary else TextMuted,
                                modifier = Modifier.padding(horizontal = 7.dp, vertical = 7.dp)
                            )
                        }
                    }
                }

                when (currentStep) {
                    0 -> {
                        Text("What are you organising?", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        Text("Set the basics so suggested athletes know exactly what they are joining.", fontSize = 12.sp, color = TextSecondary)
                        Text("Sport", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(sports) { sport ->
                                FilterChip(
                                    selected = selectedSport == sport,
                                    onClick = { selectedSport = sport },
                                    label = { Text(sport, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridSecondary,
                                        selectedLabelColor = Color.White,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    )
                                )
                            }
                        }
                        Text("Skill level", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(listOf("Any level", "Beginner", "Intermediate", "Advanced")) { level ->
                                FilterChip(
                                    selected = selectedSkill == level,
                                    onClick = { selectedSkill = level },
                                    label = { Text(level, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridPrimary,
                                        selectedLabelColor = Color.White,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    )
                                )
                            }
                        }
                        OutlinedTextField(
                            value = selectedCity,
                            onValueChange = { selectedCity = it },
                            label = { Text("City") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary, focusedLabelColor = KhelGridSecondary, unfocusedLabelColor = TextSecondary)
                        )
                        OutlinedTextField(
                            value = venue,
                            onValueChange = { venue = it },
                            label = { Text("Venue or court") },
                            placeholder = { Text("e.g. FerroHub Sports") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary, focusedLabelColor = KhelGridSecondary, unfocusedLabelColor = TextSecondary)
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            OutlinedTextField(
                                value = date,
                                onValueChange = { date = it },
                                label = { Text("Date") },
                                modifier = Modifier.weight(1f),
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary, focusedLabelColor = KhelGridSecondary, unfocusedLabelColor = TextSecondary)
                            )
                            OutlinedTextField(
                                value = time,
                                onValueChange = { time = it },
                                label = { Text("Time") },
                                modifier = Modifier.weight(1f),
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary, focusedLabelColor = KhelGridSecondary, unfocusedLabelColor = TextSecondary)
                            )
                        }
                        Text("Game format", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(listOf("Casual game", "Competitive", "Practice session")) { option ->
                                FilterChip(
                                    selected = format == option,
                                    onClick = { format = option },
                                    label = { Text(option, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridGold,
                                        selectedLabelColor = Color.Black,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    )
                                )
                            }
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("Players needed", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary, modifier = Modifier.weight(1f))
                            IconButton(onClick = { spotsNeeded = (spotsNeeded - 1).coerceAtLeast(1) }) { Icon(Icons.Default.Remove, contentDescription = "Fewer players", tint = TextSecondary) }
                            Text(spotsNeeded.toString(), fontWeight = FontWeight.Bold, color = TextPrimary)
                            IconButton(onClick = { spotsNeeded = (spotsNeeded + 1).coerceAtMost(8) }) { Icon(Icons.Default.Add, contentDescription = "More players", tint = TextSecondary) }
                        }
                    }
                    1 -> {
                        Text("Suggested athletes", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        Text("Suggestions match $selectedSport, $selectedSkill, and $selectedCity.", fontSize = 12.sp, color = TextSecondary)
                        if (matchingAthletes.isEmpty()) {
                            Surface(shape = RoundedCornerShape(14.dp), color = KhelGridSurface, border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)) {
                                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                                    Icon(Icons.Default.PersonSearch, contentDescription = null, tint = TextMuted)
                                    Text("No exact matches yet", fontWeight = FontWeight.SemiBold, color = TextPrimary)
                                    Text("You can publish the post anyway and let the community find it.", fontSize = 12.sp, color = TextSecondary)
                                }
                            }
                        } else {
                            matchingAthletes.forEach { athlete ->
                                Surface(
                                    shape = RoundedCornerShape(14.dp),
                                    color = if (athlete.id in invitedAthletes) KhelGridSecondary.copy(alpha = 0.12f) else KhelGridSurface,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, if (athlete.id in invitedAthletes) KhelGridSecondary else KhelGridCardBorder)
                                ) {
                                    Row(modifier = Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.Top) {
                                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                                            Text(athlete.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                            Text("${athlete.skillLevel} · ${athlete.city} · ${athlete.reliability}% reliability", fontSize = 11.sp, color = KhelGridSecondary)
                                            Text(athlete.availability, fontSize = 11.sp, color = TextSecondary)
                                            Text(athlete.bio, fontSize = 12.sp, color = TextMuted)
                                        }
                                        OutlinedButton(
                                            onClick = {
                                                if (athlete.id in invitedAthletes) {
                                                    invitedAthletes.remove(athlete.id)
                                                } else {
                                                    invitedAthletes.add(athlete.id)
                                                    onInvite(athlete)
                                                }
                                            },
                                            contentPadding = PaddingValues(horizontal = 9.dp, vertical = 5.dp),
                                            colors = ButtonDefaults.outlinedButtonColors(contentColor = if (athlete.id in invitedAthletes) KhelGridGreen else KhelGridSecondary),
                                            border = androidx.compose.foundation.BorderStroke(1.dp, if (athlete.id in invitedAthletes) KhelGridGreen else KhelGridSecondary)
                                        ) {
                                            Text(if (athlete.id in invitedAthletes) "Invited" else "Invite", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                        Text("${invitedAthletes.size} invite${if (invitedAthletes.size == 1) "" else "s"} selected", fontSize = 12.sp, color = KhelGridPrimaryLight)
                    }
                    2 -> {
                        Text("Preview your MatchupPost", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = TextPrimary)
                        Surface(shape = RoundedCornerShape(16.dp), color = KhelGridSurface, border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridSecondary.copy(alpha = 0.55f))) {
                            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("$selectedSport · $format", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                                Text("$date · $time", fontSize = 12.sp, color = KhelGridSecondary)
                                Text("$venue · $selectedCity", fontSize = 12.sp, color = TextSecondary)
                                Text("Looking for $spotsNeeded player${if (spotsNeeded == 1) "" else "s"} · $selectedSkill", fontSize = 12.sp, color = TextSecondary)
                                Text("${invitedAthletes.size} direct invite${if (invitedAthletes.size == 1) "" else "s"} ready", fontSize = 12.sp, color = KhelGridGold)
                            }
                        }
                        OutlinedTextField(
                            value = message,
                            onValueChange = { message = it },
                            label = { Text("Message to the community") },
                            placeholder = { Text(defaultMessage) },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 3,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary, focusedLabelColor = KhelGridSecondary, unfocusedLabelColor = TextSecondary)
                        )
                    }
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    if (currentStep > 0) {
                        OutlinedButton(
                            onClick = { currentStep-- },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary),
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                        ) { Text("Back") }
                    }
                    Button(
                        onClick = {
                            if (currentStep < steps.lastIndex) {
                                currentStep++
                            } else {
                                onPublish(MatchupPost(sport = selectedSport, skillLevel = selectedSkill, city = selectedCity, date = date, time = time, venue = venue, format = format, spotsNeeded = spotsNeeded, message = message.ifBlank { defaultMessage }))
                                onDismiss()
                            }
                        },
                        enabled = currentStep != 0 || venue.isNotBlank(),
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = KhelGridSecondary)
                    ) {
                        Text(if (currentStep == steps.lastIndex) "Publish MatchupPost" else "Continue", fontWeight = FontWeight.Bold, color = if (currentStep == steps.lastIndex) Color.Black else Color.White)
                    }
                }
            }
        }
    }
}
