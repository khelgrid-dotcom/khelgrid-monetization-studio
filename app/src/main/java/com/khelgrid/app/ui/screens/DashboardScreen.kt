package com.khelgrid.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khelgrid.app.data.model.UserAuthState
import com.khelgrid.app.data.model.UserPlan
import com.khelgrid.app.data.model.UserRole
import com.khelgrid.app.data.repository.SportsRepository
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.components.WalletTopUpDialog
import com.khelgrid.app.ui.theme.*

@Composable
fun DashboardScreen(
    userState: UserAuthState,
    onShowMessage: (String) -> Unit
) {
    var showTopUpDialog by remember { mutableStateOf(false) }
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(KhelGridBg),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Athlete Header Card
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(KhelGridPrimary, Color(0xFF3B82F6))
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "AM",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = userState.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = TextPrimary
                                )

                                if (userState.sportsCVUnlocked || userState.plan == UserPlan.PRO) {
                                    Icon(
                                        Icons.Default.Verified,
                                        contentDescription = "Verified Athlete",
                                        tint = KhelGridSecondary,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }

                            Text(
                                text = "${userState.sport} · ${userState.location}",
                                fontSize = 13.sp,
                                color = TextSecondary
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (userState.plan == UserPlan.PRO) KhelGridGold.copy(alpha = 0.2f) else KhelGridSurface,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (userState.plan == UserPlan.PRO) KhelGridGold else KhelGridCardBorder
                                )
                            ) {
                                Text(
                                    text = if (userState.plan == UserPlan.PRO) "👑 KhelGrid Pro Member" else "Free Tier (2 free apps)",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (userState.plan == UserPlan.PRO) KhelGridGold else TextSecondary,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Role switch row
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(KhelGridSurface)
                            .padding(4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Button(
                            onClick = { UserSessionRepository.setRole(UserRole.ATHLETE) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (userState.role == UserRole.ATHLETE) KhelGridPrimary else Color.Transparent
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f),
                            contentPadding = PaddingValues(vertical = 8.dp)
                        ) {
                            Text(
                                "Athlete Mode",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (userState.role == UserRole.ATHLETE) Color.White else TextSecondary
                            )
                        }

                        Button(
                            onClick = { UserSessionRepository.setRole(UserRole.ORGANIZER) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (userState.role == UserRole.ORGANIZER) KhelGridGold else Color.Transparent
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f),
                            contentPadding = PaddingValues(vertical = 8.dp)
                        ) {
                            Text(
                                "Organizer Mode",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (userState.role == UserRole.ORGANIZER) Color.Black else TextSecondary
                            )
                        }
                    }
                }
            }
        }

        // Wallet & Membership Quick Action
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Wallet Box
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Wallet Balance", fontSize = 12.sp, color = TextSecondary)
                            Icon(Icons.Default.AccountBalanceWallet, contentDescription = null, tint = KhelGridGreen, modifier = Modifier.size(16.dp))
                        }
                        Text("₹${userState.wallet}", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { showTopUpDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = KhelGridGreen),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("+ Top Up", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }

                // Plan Upgrade Box
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = KhelGridCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold.copy(alpha = 0.5f)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("KhelGrid Pro", fontSize = 12.sp, color = TextSecondary)
                            Icon(Icons.Default.Stars, contentDescription = null, tint = KhelGridGold, modifier = Modifier.size(16.dp))
                        }
                        Text(
                            text = if (userState.plan == UserPlan.PRO) "Active" else "₹499/mo",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = KhelGridGold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = {
                                if (userState.plan == UserPlan.PRO) {
                                    onShowMessage("KhelGrid Pro is active with unlimited applications!")
                                } else {
                                    UserSessionRepository.upgradeToPro()
                                    onShowMessage("Upgraded to KhelGrid Pro successfully!")
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (userState.plan == UserPlan.PRO) KhelGridCardBorder else KhelGridGold
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = if (userState.plan == UserPlan.PRO) "Subscribed" else "Upgrade",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (userState.plan == UserPlan.PRO) TextSecondary else Color.Black
                            )
                        }
                    }
                }
            }
        }

        // Referral community section
        item {
            val referralGoal = 3
            val referralProgress = (userState.successfulReferrals.toFloat() / referralGoal).coerceIn(0f, 1f)
            val inviteLink = "https://khelgrid.com/join?ref=${userState.referralCode}"

            Surface(
                shape = RoundedCornerShape(18.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridPrimary.copy(alpha = 0.6f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.Group, contentDescription = "Refer teammates", tint = KhelGridPrimaryLight)
                            Text("Build Your KhelGrid Crew", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                        }
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = KhelGridGreen.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = "₹100 / FRIEND",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = KhelGridGreen,
                                modifier = Modifier.padding(horizontal = 7.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Invite teammates to join KhelGrid. You both get ₹100 wallet credit when they complete their first application.",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("${userState.successfulReferrals}/$referralGoal friends joined", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(modifier = Modifier.height(7.dp))
                            LinearProgressIndicator(
                                progress = { referralProgress },
                                modifier = Modifier.fillMaxWidth().height(7.dp),
                                color = KhelGridPrimary,
                                trackColor = KhelGridSurface
                            )
                            Spacer(modifier = Modifier.height(5.dp))
                            Text("₹${userState.referralRewards} earned · ${userState.referralInvitesSent} invites sent", fontSize = 11.sp, color = TextSecondary)
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = KhelGridSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder)
                        ) {
                            Column(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("YOUR CODE", fontSize = 9.sp, color = TextMuted, fontWeight = FontWeight.Bold)
                                Text(userState.referralCode, fontSize = 14.sp, color = KhelGridGold, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            clipboard.setPrimaryClip(ClipData.newPlainText("KhelGrid invite", inviteLink))
                            UserSessionRepository.recordReferralInvite()
                            onShowMessage("Invite link copied. Share it with your teammates!")
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copy invite link", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(7.dp))
                        Text("Copy Invite Link", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }
        }

        // Verified Sports CV Section
        item {
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = KhelGridCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.Badge, contentDescription = "CV", tint = KhelGridSecondary)
                            Text("Verified Sports CV", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                        }

                        if (userState.sportsCVUnlocked || userState.plan == UserPlan.PRO) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = KhelGridSecondary.copy(alpha = 0.2f)
                            ) {
                                Text(
                                    text = "VERIFIED ✓",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KhelGridSecondary,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Headline: Right-arm Fast Bowler & Middle-order Batter (U-19 State Squad)",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextPrimary
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(KhelGridSurface)
                            .padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text("Top Verified Results:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                        Text("• 5/24 vs Capital Cricket Academy (Inter-District Trophy 2025)", fontSize = 12.sp, color = TextPrimary)
                        Text("• Yo-Yo IR1 Fitness Benchmark: 18.2 (State Combine)", fontSize = 12.sp, color = TextPrimary)
                        Text("• Coach Reference: Coach Arjun Mehta (Level 2 BCCI Certified)", fontSize = 12.sp, color = TextPrimary)
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    if (userState.sportsCVUnlocked || userState.plan == UserPlan.PRO) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Button(
                                onClick = { onShowMessage("Sports CV PDF downloaded to device storage!") },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = KhelGridSecondary),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Download, contentDescription = "Download", tint = Color.Black, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Download PDF", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }

                            OutlinedButton(
                                onClick = { onShowMessage("Public share link copied: https://khelgrid.com/cv/arjun-mehta") },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                                border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Share, contentDescription = "Share", tint = TextPrimary, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Share Link", fontSize = 12.sp)
                            }
                        }
                    } else {
                        Button(
                            onClick = {
                                val ok = UserSessionRepository.unlockSportsCV(viaWallet = false)
                                if (ok) onShowMessage("Verified Sports CV unlocked!")
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Unlock Verified Sports CV (₹199 or free with Pro)", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    }
                }
            }
        }

        // Applied Trials List
        item {
            Column {
                Text(
                    text = "My Applications (${userState.applications.size})",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = TextPrimary
                )

                Spacer(modifier = Modifier.height(10.dp))

                if (userState.applications.isEmpty()) {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = KhelGridCard,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "You haven't applied to any trials yet. Explore the Trials tab to apply!",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        userState.applications.forEach { trialId ->
                            val trial = SportsRepository.trials.find { it.id == trialId }
                            trial?.let { t ->
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = KhelGridCard,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(14.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(t.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                            Text("${t.academy} · 📍 ${t.city}", fontSize = 12.sp, color = TextSecondary)
                                            Text("📅 Trial Date: ${t.date}", fontSize = 11.sp, color = TextMuted)
                                        }

                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = KhelGridGreen.copy(alpha = 0.15f)
                                        ) {
                                            Text(
                                                text = "UNDER REVIEW",
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = KhelGridGreen,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showTopUpDialog) {
        WalletTopUpDialog(
            userState = userState,
            onDismiss = { showTopUpDialog = false },
            onSuccess = { msg ->
                showTopUpDialog = false
                onShowMessage(msg)
            }
        )
    }
}
