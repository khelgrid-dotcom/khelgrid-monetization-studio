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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khelgrid.app.data.model.UserAuthState
import com.khelgrid.app.data.model.UserPlan
import com.khelgrid.app.data.model.UserRole
import com.khelgrid.app.data.repository.SportsRepository
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.theme.*

@Composable
fun HomeScreen(
    userState: UserAuthState,
    onNavigateToSearch: (String) -> Unit,
    onNavigateToPlay: () -> Unit,
    onNavigateToTrain: () -> Unit,
    onNavigateToDashboard: () -> Unit,
    onShowMessage: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(KhelGridBg),
        contentPadding = PaddingValues(bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Hero Section
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color(0xFF2A1454).copy(alpha = 0.6f),
                                KhelGridBg
                            )
                        )
                    )
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    // Badge
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = KhelGridPrimary.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridPrimary.copy(alpha = 0.4f))
                    ) {
                        Text(
                            text = "🇮🇳 INDIA'S SPORTS OPPORTUNITY NETWORK",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = KhelGridPrimaryLight,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Discover.\nParticipate. Compete.",
                        style = MaterialTheme.typography.headlineLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = TextPrimary,
                        lineHeight = 36.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Trials, academies, tournaments, venues and scholarships across India.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    // Quick Search Bar
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = KhelGridCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search",
                                tint = TextSecondary,
                                modifier = Modifier.size(20.dp)
                            )

                            OutlinedTextField(
                                value = searchQuery,
                                onValueChange = { searchQuery = it },
                                placeholder = { Text("Search sports, academies, cities...", fontSize = 13.sp, color = TextMuted) },
                                modifier = Modifier.weight(1f),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color.Transparent,
                                    unfocusedBorderColor = Color.Transparent,
                                    focusedTextColor = TextPrimary,
                                    unfocusedTextColor = TextPrimary
                                ),
                                singleLine = true
                            )

                            Button(
                                onClick = { onNavigateToSearch(searchQuery) },
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                            ) {
                                Text("Find", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Metrics row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        MetricPill(icon = "🏆", label = "1,200+ Live Trials")
                        MetricPill(icon = "🛡️", label = "86k Athletes")
                        MetricPill(icon = "👑", label = "240 Academies")
                    }
                }
            }
        }

        // Quick Category Hub Tiles
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    text = "Explore Categories",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    CategoryHubCard(
                        title = "Trials",
                        sub = "Scout Combines",
                        icon = Icons.Default.EmojiEvents,
                        accentColor = KhelGridPrimary,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigateToSearch("") }
                    )

                    CategoryHubCard(
                        title = "Play",
                        sub = "Join Games",
                        icon = Icons.Default.SportsTennis,
                        accentColor = KhelGridSecondary,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToPlay
                    )

                    CategoryHubCard(
                        title = "Coaching",
                        sub = "Academy Pro",
                        icon = Icons.Default.FitnessCenter,
                        accentColor = KhelGridGold,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToTrain
                    )
                }
            }
        }

        // Monetization & Membership Highlights
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Monetization Studio",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    Text(
                        text = "For Athletes & Academies",
                        fontSize = 12.sp,
                        color = KhelGridGold
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    // Pro Card
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = KhelGridCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridGold.copy(alpha = 0.6f)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                if (userState.plan == UserPlan.PRO) {
                                    onShowMessage("You are already enjoying KhelGrid Pro benefits!")
                                } else {
                                    UserSessionRepository.upgradeToPro()
                                    onShowMessage("Upgraded to KhelGrid Pro! Unlimited applications & Verified CV unlocked.")
                                }
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        Brush.linearGradient(
                                            listOf(KhelGridGold, Color(0xFFD97706))
                                        )
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Stars, contentDescription = "Pro", tint = Color.Black, modifier = Modifier.size(28.dp))
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text("KhelGrid Pro", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                                    Text("₹499/mo", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = KhelGridGold)
                                }
                                Text(
                                    text = "Unlimited trial applications, Verified Sports CV badge & direct scout messaging.",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                            }

                            Button(
                                onClick = {
                                    if (userState.plan == UserPlan.PRO) {
                                        onShowMessage("Already Active")
                                    } else {
                                        UserSessionRepository.upgradeToPro()
                                        onShowMessage("Upgraded to Pro!")
                                    }
                                },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (userState.plan == UserPlan.PRO) KhelGridGreen else KhelGridGold
                                ),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = if (userState.plan == UserPlan.PRO) "Active" else "Upgrade",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (userState.plan == UserPlan.PRO) Color.White else Color.Black
                                )
                            }
                        }
                    }

                    // Micropayment info card
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = KhelGridSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onNavigateToSearch("") }
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Icon(Icons.Default.Bolt, contentDescription = "Pay", tint = KhelGridPrimary, modifier = Modifier.size(22.dp))
                                Spacer(modifier = Modifier.height(6.dp))
                                Text("Micropayments", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                Text("₹49 / application", fontSize = 12.sp, color = KhelGridPrimaryLight)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("2 free trials included. Unlock more with 1-tap wallet.", fontSize = 11.sp, color = TextMuted)
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = KhelGridSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    UserSessionRepository.setRole(UserRole.ORGANIZER)
                                    onNavigateToSearch("")
                                    onShowMessage("Switched to Academy / Organizer mode. You can now boost trials!")
                                }
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Icon(Icons.Default.LocalFireDepartment, contentDescription = "Boost", tint = KhelGridGold, modifier = Modifier.size(22.dp))
                                Spacer(modifier = Modifier.height(6.dp))
                                Text("Academy Boost", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                Text("₹1,500 / 7 days", fontSize = 12.sp, color = KhelGridGold)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Pin opportunities to top with glowing featured card.", fontSize = 11.sp, color = TextMuted)
                            }
                        }
                    }
                }
            }
        }

        // Featured & Scouted Trials
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Featured Selections",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    Text(
                        text = "View All Trials →",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = KhelGridPrimaryLight,
                        modifier = Modifier.clickable { onNavigateToSearch("") }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    contentPadding = PaddingValues(horizontal = 2.dp)
                ) {
                    val featuredList = SportsRepository.trials.filter { it.id in userState.boostedTrials || it.tag == "Elite" || it.tag == "Scouted" }
                    items(featuredList) { trial ->
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = KhelGridCard,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (trial.id in userState.boostedTrials) KhelGridGold else KhelGridCardBorder
                            ),
                            modifier = Modifier
                                .width(270.dp)
                                .clickable { onNavigateToSearch(trial.sport) }
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = if (trial.id in userState.boostedTrials) KhelGridGold.copy(alpha = 0.2f) else KhelGridPrimary.copy(alpha = 0.2f)
                                    ) {
                                        Text(
                                            text = if (trial.id in userState.boostedTrials) "🔥 FEATURED" else trial.tag.uppercase(),
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (trial.id in userState.boostedTrials) KhelGridGold else KhelGridPrimaryLight,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                        )
                                    }

                                    Text(
                                        text = trial.sport,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = TextSecondary
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = trial.title,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = TextPrimary,
                                    maxLines = 2
                                )

                                Text(
                                    text = trial.academy,
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text("📍 ${trial.city}", fontSize = 11.sp, color = TextMuted)
                                        Text("📅 ${trial.date}", fontSize = 11.sp, color = TextMuted)
                                    }

                                    Text(
                                        text = if (trial.fee == 0) "FREE" else "₹${trial.fee}",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (trial.fee == 0) KhelGridGreen else KhelGridGold
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Sports Directory Grid
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    text = "Browse by Sport",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                Spacer(modifier = Modifier.height(12.dp))

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    SportsRepository.sportsCategories.chunked(2).forEach { rowSports ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            rowSports.forEach { sport ->
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = KhelGridSurface,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                                    modifier = Modifier
                                        .weight(1f)
                                        .clickable { onNavigateToSearch(sport.name) }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Text(text = sport.emoji, fontSize = 22.sp)
                                        Column {
                                            Text(sport.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                            Text(sport.ageBand, fontSize = 10.sp, color = TextMuted)
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
}

@Composable
private fun MetricPill(icon: String, label: String) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = KhelGridSurface.copy(alpha = 0.8f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(icon, fontSize = 12.sp)
            Text(label, fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun CategoryHubCard(
    title: String,
    sub: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = KhelGridCard,
        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
        modifier = modifier.clickable { onClick() }
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(accentColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = title, tint = accentColor, modifier = Modifier.size(20.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
            Text(sub, fontSize = 11.sp, color = TextMuted)
        }
    }
}
