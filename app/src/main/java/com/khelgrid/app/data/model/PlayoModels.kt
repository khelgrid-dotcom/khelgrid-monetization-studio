package com.khelgrid.app.data.model

data class Venue(
    val id: String,
    val name: String,
    val area: String,
    val city: String,
    val distanceKm: Double,
    val rating: Double,
    val reviews: Int,
    val sports: List<String>,
    val pricePerHour: Int,
    val featured: Boolean = false,
    val bookable: Boolean = true,
    val image: String
)

data class CoachingProgram(
    val id: String,
    val title: String,
    val coach: String,
    val sport: String,
    val city: String,
    val area: String,
    val level: String,
    val pricePerMonth: Int,
    val rating: Double,
    val image: String
)

data class SportEvent(
    val id: String,
    val title: String,
    val sport: String,
    val city: String,
    val venue: String,
    val date: String,
    val time: String,
    val entryFee: Int,
    val spotsLeft: Int,
    val format: String,
    val image: String
)

data class Game(
    val id: String,
    val sport: String,
    val city: String,
    val venue: String,
    val date: String,
    val time: String,
    val skillLevel: String,
    val host: String,
    val joined: Int,
    val capacity: Int,
    val costPerPlayer: Int
)

data class Membership(
    val id: String,
    val name: String,
    val venue: String,
    val city: String,
    val sport: String,
    val durationMonths: Int,
    val price: Int,
    val perks: List<String>,
    val popular: Boolean = false
)
