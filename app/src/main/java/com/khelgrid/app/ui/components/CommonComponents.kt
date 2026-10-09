package com.khelgrid.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import com.khelgrid.app.data.model.Trial
import com.khelgrid.app.data.model.UserAuthState
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
