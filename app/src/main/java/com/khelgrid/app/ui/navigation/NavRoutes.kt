package com.khelgrid.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val iconFilled: ImageVector,
    val iconOutlined: ImageVector
) {
    object Home : Screen("home", "Discover", Icons.Filled.Explore, Icons.Outlined.Explore)
    object Search : Screen("search", "Trials", Icons.Filled.EmojiEvents, Icons.Outlined.EmojiEvents)
    object Play : Screen("play", "Play & Book", Icons.Filled.SportsTennis, Icons.Outlined.SportsTennis)
    object Train : Screen("train", "Train", Icons.Filled.FitnessCenter, Icons.Outlined.FitnessCenter)
    object Dashboard : Screen("dashboard", "My Hub", Icons.Filled.Person, Icons.Outlined.Person)
}

val BOTTOM_NAV_ITEMS = listOf(
    Screen.Home,
    Screen.Search,
    Screen.Play,
    Screen.Train,
    Screen.Dashboard
)
