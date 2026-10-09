package com.khelgrid.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.khelgrid.app.data.model.UserAuthState
import com.khelgrid.app.data.repository.SportsRepository
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.theme.*

@Composable
fun PlayBookScreen(
    userState: UserAuthState,
    onShowMessage: (String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }
    val bookedVenues by UserSessionRepository.bookedVenues.collectAsState()
    val joinedGames by UserSessionRepository.joinedGames.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KhelGridBg)
    ) {
        // Tab Header
        Surface(
            color = KhelGridSurface,
            modifier = Modifier.fillMaxWidth()
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = KhelGridSurface,
                contentColor = KhelGridPrimaryLight,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                        color = KhelGridPrimary
                    )
                }
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Book Venues (${SportsRepository.venues.size})", fontWeight = FontWeight.SemiBold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Pickup Games (${SportsRepository.games.size})", fontWeight = FontWeight.SemiBold) }
                )
            }
        }

        if (selectedTab == 0) {
            // Venues List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Text(
                        text = "Sports Complexes, Courts & Turfs",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                }

                items(SportsRepository.venues, key = { it.id }) { venue ->
                    val isBooked = venue.id in bookedVenues

                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = KhelGridCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            // Venue Image Header
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(130.dp)
                                    .background(KhelGridSurface)
                            ) {
                                AsyncImage(
                                    model = venue.image,
                                    contentDescription = venue.name,
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )

                                if (venue.featured) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = KhelGridGold,
                                        modifier = Modifier
                                            .align(Alignment.TopStart)
                                            .padding(10.dp)
                                    ) {
                                        Text(
                                            text = "POPULAR",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.Black,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color.Black.copy(alpha = 0.7f),
                                    modifier = Modifier
                                        .align(Alignment.BottomEnd)
                                        .padding(10.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(Icons.Default.Star, contentDescription = "Rating", tint = KhelGridGold, modifier = Modifier.size(14.dp))
                                        Text("${venue.rating} (${venue.reviews})", fontSize = 11.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            // Content
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = venue.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = TextPrimary
                                )

                                Text(
                                    text = "📍 ${venue.area}, ${venue.city} · ${venue.distanceKm} km away",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    venue.sports.forEach { s ->
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = KhelGridSurface
                                        ) {
                                            Text(
                                                text = s,
                                                fontSize = 11.sp,
                                                color = KhelGridPrimaryLight,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text("Price per hour", fontSize = 11.sp, color = TextMuted)
                                        Text("₹${venue.pricePerHour}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = KhelGridGreen)
                                    }

                                    Button(
                                        onClick = {
                                            if (isBooked) {
                                                onShowMessage("Slot already reserved for ${venue.name}")
                                            } else {
                                                UserSessionRepository.bookVenue(venue.id)
                                                onShowMessage("Slot booked at ${venue.name}!")
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (isBooked) KhelGridGreen.copy(alpha = 0.2f) else KhelGridPrimary
                                        ),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Text(
                                            text = if (isBooked) "Slot Booked ✓" else "Book Slot",
                                            fontWeight = FontWeight.Bold,
                                            color = if (isBooked) KhelGridGreen else Color.White,
                                            fontSize = 13.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Community Pickup Games
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Text(
                        text = "Join games hosted by nearby players & split court costs",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                }

                items(SportsRepository.games, key = { it.id }) { game ->
                    val isJoined = game.id in joinedGames

                    Surface(
                        shape = RoundedCornerShape(16.dp),
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
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = KhelGridSecondary.copy(alpha = 0.15f)
                                ) {
                                    Text(
                                        text = game.sport,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = KhelGridSecondary,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = KhelGridSurface
                                ) {
                                    Text(
                                        text = game.skillLevel,
                                        fontSize = 11.sp,
                                        color = TextSecondary,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Game at ${game.venue}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = TextPrimary
                            )

                            Text(
                                text = "Hosted by ${game.host} · ${game.city}",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("📅 ${game.date}, ${game.time}", fontSize = 12.sp, color = TextSecondary)
                                Text("👥 ${game.joined}/${game.capacity} joined", fontSize = 12.sp, color = KhelGridGold, fontWeight = FontWeight.Medium)
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Per Player Share", fontSize = 11.sp, color = TextMuted)
                                    Text("₹${game.costPerPlayer}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = KhelGridGreen)
                                }

                                Button(
                                    onClick = {
                                        if (isJoined) {
                                            onShowMessage("You are already playing in this game!")
                                        } else {
                                            UserSessionRepository.joinGame(game.id)
                                            onShowMessage("Joined game! See you at ${game.venue}.")
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isJoined) KhelGridGreen.copy(alpha = 0.2f) else KhelGridSecondary
                                    ),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = if (isJoined) "Joined ✓" else "Join Match",
                                        fontWeight = FontWeight.Bold,
                                        color = if (isJoined) KhelGridGreen else Color.Black,
                                        fontSize = 13.sp
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
