package com.khelgrid.app.data.model

data class Trial(
    val id: String = "",
    val title: String,
    val academy: String,
    val sport: String,
    val city: String,
    val date: String,
    val fee: Int,
    val spots: Int,
    val tag: String
)

val SPORTS_LIST = listOf(
    "All Sports", "Cricket", "Football", "Badminton", "Athletics", "Hockey", "Tennis"
)

val CITIES_LIST = listOf(
    "All Locations", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chandigarh", "Pune"
)
