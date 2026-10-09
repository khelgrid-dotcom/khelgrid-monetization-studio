package com.khelgrid.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
fun TrainEventsScreen(
    userState: UserAuthState,
    onShowMessage: (String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }
    var coachSearchQuery by remember { mutableStateOf("") }
    var selectedCoachSport by remember { mutableStateOf("All sports") }
    var selectedExperienceLevel by remember { mutableStateOf("All levels") }
    var selectedMinimumRating by remember { mutableStateOf<Double?>(null) }
    val enrolledEvents by UserSessionRepository.enrolledEvents.collectAsState()

    val coachSports = remember {
        listOf("All sports") + SportsRepository.coachingPrograms.map { it.sport }.distinct().sorted()
    }
    val experienceLevels = remember {
        listOf("All levels") + SportsRepository.coachingPrograms.map { it.level }.distinct().sorted()
    }
    val ratingOptions: List<Pair<Double?, String>> = listOf(
        null to "Any rating",
        4.5 to "4.5+",
        4.7 to "4.7+",
        4.8 to "4.8+"
    )
    val filteredCoachingPrograms = remember(
        coachSearchQuery,
        selectedCoachSport,
        selectedExperienceLevel,
        selectedMinimumRating
    ) {
        val query = coachSearchQuery.trim().lowercase()
        SportsRepository.coachingPrograms.filter { program ->
            if (selectedCoachSport != "All sports" && program.sport != selectedCoachSport) return@filter false
            if (selectedExperienceLevel != "All levels" && program.level != selectedExperienceLevel) return@filter false
            if (selectedMinimumRating?.let { program.rating >= it } == false) return@filter false
            if (query.isNotEmpty()) {
                val searchableText = "${program.title} ${program.coach} ${program.sport} ${program.level} ${program.city} ${program.area}".lowercase()
                if (!searchableText.contains(query)) return@filter false
            }
            true
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KhelGridBg)
    ) {
        // Tab Bar
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
                    text = { Text("Coaching Academies", fontWeight = FontWeight.SemiBold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Tournaments & Events", fontWeight = FontWeight.SemiBold) }
                )
            }
        }

        if (selectedTab == 0) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 100.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 16.dp)
                    ) {
                        Text(
                            text = "Find your academy mentor",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Search verified coaches and training centers by sport, experience level, or rating.",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = KhelGridCard,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 3.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = "Search coaches",
                                    tint = TextSecondary,
                                    modifier = Modifier.size(18.dp)
                                )
                                OutlinedTextField(
                                    value = coachSearchQuery,
                                    onValueChange = { coachSearchQuery = it },
                                    placeholder = {
                                        Text(
                                            "Search coach, academy, or location",
                                            fontSize = 13.sp,
                                            color = TextMuted
                                        )
                                    },
                                    modifier = Modifier.weight(1f),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = Color.Transparent,
                                        unfocusedBorderColor = Color.Transparent,
                                        focusedTextColor = TextPrimary,
                                        unfocusedTextColor = TextPrimary
                                    ),
                                    singleLine = true
                                )
                                if (coachSearchQuery.isNotEmpty()) {
                                    IconButton(onClick = { coachSearchQuery = "" }) {
                                        Icon(
                                            Icons.Default.Close,
                                            contentDescription = "Clear coach search",
                                            tint = TextSecondary,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                item {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = "Sport",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextSecondary,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(coachSports) { sport ->
                                FilterChip(
                                    selected = selectedCoachSport == sport,
                                    onClick = { selectedCoachSport = sport },
                                    label = { Text(sport, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridPrimary,
                                        selectedLabelColor = Color.White,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    ),
                                    border = FilterChipDefaults.filterChipBorder(
                                        enabled = true,
                                        selected = selectedCoachSport == sport,
                                        borderColor = KhelGridCardBorder,
                                        selectedBorderColor = KhelGridPrimaryLight
                                    )
                                )
                            }
                        }
                    }
                }

                item {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = "Experience level",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextSecondary,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(experienceLevels) { level ->
                                FilterChip(
                                    selected = selectedExperienceLevel == level,
                                    onClick = { selectedExperienceLevel = level },
                                    label = { Text(level, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridSecondary,
                                        selectedLabelColor = Color.White,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    ),
                                    border = FilterChipDefaults.filterChipBorder(
                                        enabled = true,
                                        selected = selectedExperienceLevel == level,
                                        borderColor = KhelGridCardBorder,
                                        selectedBorderColor = KhelGridSecondary
                                    )
                                )
                            }
                        }
                    }
                }

                item {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = "Minimum mentor rating",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextSecondary,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(ratingOptions, key = { it.second }) { (minimumRating, label) ->
                                FilterChip(
                                    selected = selectedMinimumRating == minimumRating,
                                    onClick = { selectedMinimumRating = minimumRating },
                                    label = { Text(label, fontSize = 12.sp) },
                                    leadingIcon = if (minimumRating != null) {
                                        {
                                            Icon(
                                                Icons.Default.Star,
                                                contentDescription = null,
                                                tint = KhelGridGold,
                                                modifier = Modifier.size(15.dp)
                                            )
                                        }
                                    } else {
                                        null
                                    },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = KhelGridGold.copy(alpha = 0.24f),
                                        selectedLabelColor = KhelGridGoldLight,
                                        containerColor = KhelGridSurface,
                                        labelColor = TextSecondary
                                    ),
                                    border = FilterChipDefaults.filterChipBorder(
                                        enabled = true,
                                        selected = selectedMinimumRating == minimumRating,
                                        borderColor = KhelGridCardBorder,
                                        selectedBorderColor = KhelGridGold
                                    )
                                )
                            }
                        }
                    }
                }

                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${filteredCoachingPrograms.size} academy mentors found",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        if (coachSearchQuery.isNotEmpty() || selectedCoachSport != "All sports" || selectedExperienceLevel != "All levels" || selectedMinimumRating != null) {
                            TextButton(
                                onClick = {
                                    coachSearchQuery = ""
                                    selectedCoachSport = "All sports"
                                    selectedExperienceLevel = "All levels"
                                    selectedMinimumRating = null
                                },
                                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text("Reset", fontSize = 12.sp, color = KhelGridPrimaryLight)
                            }
                        }
                    }
                }

                if (filteredCoachingPrograms.isEmpty()) {
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = KhelGridCard,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                        ) {
                            Column(
                                modifier = Modifier.padding(20.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.SearchOff, contentDescription = null, tint = TextMuted)
                                Text("No mentors match these filters", fontWeight = FontWeight.SemiBold, color = TextPrimary)
                                Text("Try changing a filter or resetting your search.", fontSize = 12.sp, color = TextSecondary)
                            }
                        }
                    }
                } else {
                    items(filteredCoachingPrograms, key = { it.id }) { program ->
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = KhelGridCard,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KhelGridCardBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.spacedBy(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(80.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(KhelGridSurface)
                                ) {
                                    AsyncImage(
                                        model = program.image,
                                        contentDescription = program.title,
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )
                                }

                                Column(modifier = Modifier.weight(1f)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = KhelGridPrimary.copy(alpha = 0.2f)
                                        ) {
                                            Text(
                                                text = program.sport,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = KhelGridPrimaryLight,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }

                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = KhelGridSurface
                                        ) {
                                            Text(
                                                text = program.level,
                                                fontSize = 10.sp,
                                                color = TextSecondary,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    Text(
                                        text = program.title,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = TextPrimary
                                    )

                                    Text(
                                        text = "${program.coach} · ${program.area}, ${program.city}",
                                        fontSize = 12.sp,
                                        color = TextSecondary
                                    )

                                    Spacer(modifier = Modifier.height(6.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Star,
                                            contentDescription = "${program.rating} star mentor rating",
                                            tint = KhelGridGold,
                                            modifier = Modifier.size(15.dp)
                                        )
                                        Text(
                                            text = "${program.rating} mentor rating",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = KhelGridGoldLight
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "₹${program.pricePerMonth}/mo",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = KhelGridGold
                                        )

                                        Button(
                                            onClick = {
                                                onShowMessage("Enquiry sent to ${program.coach}! Academy coordinator will contact you.")
                                            },
                                            shape = RoundedCornerShape(8.dp),
                                            colors = ButtonDefaults.buttonColors(containerColor = KhelGridPrimary),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                        ) {
                                            Text("Enquire", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Tournaments List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Text(
                        text = "Upcoming Tournaments, Leagues & Cups",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                }

                items(SportsRepository.events, key = { it.id }) { event ->
                    val isEnrolled = event.id in enrolledEvents

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
                                    color = KhelGridGold.copy(alpha = 0.2f)
                                ) {
                                    Text(
                                        text = event.sport,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = KhelGridGold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }

                                Text(
                                    text = "${event.spotsLeft} slots remaining",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = event.title,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = TextPrimary
                            )

                            Text(
                                text = "📍 ${event.venue}, ${event.city}",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("📅 ${event.date} · ${event.time}", fontSize = 12.sp, color = TextSecondary)
                                Text("Format: ${event.format}", fontSize = 12.sp, color = TextMuted)
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Team Entry Fee", fontSize = 11.sp, color = TextMuted)
                                    Text("₹${event.entryFee}", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = KhelGridGreen)
                                }

                                Button(
                                    onClick = {
                                        if (isEnrolled) {
                                            onShowMessage("Already registered for ${event.title}")
                                        } else {
                                            UserSessionRepository.registerEvent(event.id)
                                            onShowMessage("Registration confirmed for ${event.title}!")
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isEnrolled) KhelGridGreen.copy(alpha = 0.2f) else KhelGridGold
                                    ),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = if (isEnrolled) "Registered ✓" else "Register Team",
                                        fontWeight = FontWeight.Bold,
                                        color = if (isEnrolled) KhelGridGreen else Color.Black,
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
