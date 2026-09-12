package com.khelgrid.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
