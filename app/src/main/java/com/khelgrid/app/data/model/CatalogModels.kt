package com.khelgrid.app.data.model

data class SportCategory(
    val slug: String,
    val name: String,
    val tagline: String,
    val level: String,
    val ageBand: String,
    val emoji: String,
    val highlights: List<String>
)

data class CityHub(
    val slug: String,
    val name: String,
    val state: String,
    val tagline: String,
    val venues: Int,
    val hubs: List<String>
)

data class SportsGuide(
    val slug: String,
    val title: String,
    val category: String,
    val readMins: Int,
    val excerpt: String,
    val steps: List<String>
)

data class SportsTool(
    val slug: String,
    val name: String,
    val category: String,
    val blurb: String
)
