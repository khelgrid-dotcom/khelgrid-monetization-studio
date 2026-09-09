package com.khelgrid.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khelgrid.app.data.repository.UserSessionRepository
import com.khelgrid.app.ui.components.KhelGridTopBar
import com.khelgrid.app.ui.components.WalletTopUpDialog
import com.khelgrid.app.ui.navigation.BOTTOM_NAV_ITEMS
import com.khelgrid.app.ui.navigation.Screen
import com.khelgrid.app.ui.screens.*
import com.khelgrid.app.ui.theme.*
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            KhelGridTheme {
                val userState by UserSessionRepository.userState.collectAsState()
                var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }
                var searchInitialSport by remember { mutableStateOf("All Sports") }

                val snackbarHostState = remember { SnackbarHostState() }
                val scope = rememberCoroutineScope()
                var showWalletTopUp by remember { mutableStateOf(false) }

                fun showToast(message: String) {
                    scope.launch {
                        snackbarHostState.showSnackbar(
                            message = message,
                            duration = SnackbarDuration.Short
                        )
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = KhelGridBg,
                    snackbarHost = {
                        SnackbarHost(
                            hostState = snackbarHostState,
                            modifier = Modifier.padding(bottom = 70.dp)
                        )
                    },
                    topBar = {
                        KhelGridTopBar(
                            userState = userState,
                            onTopUpClick = { showWalletTopUp = true }
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = KhelGridSurface,
                            tonalElevation = 8.dp,
                            modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
                        ) {
                            BOTTOM_NAV_ITEMS.forEach { screen ->
                                val selected = currentScreen.route == screen.route
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = {
                                        if (screen == Screen.Search) {
                                            searchInitialSport = "All Sports"
                                        }
                                        currentScreen = screen
                                    },
                                    icon = {
                                        Icon(
                                            imageVector = if (selected) screen.iconFilled else screen.iconOutlined,
                                            contentDescription = screen.title
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = screen.title,
                                            fontSize = 11.sp,
                                            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = KhelGridPrimaryLight,
                                        selectedTextColor = KhelGridPrimaryLight,
                                        indicatorColor = KhelGridPrimary.copy(alpha = 0.2f),
                                        unselectedIconColor = TextSecondary,
                                        unselectedTextColor = TextSecondary
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentScreen) {
                            is Screen.Home -> HomeScreen(
                                userState = userState,
                                onNavigateToSearch = { queryOrSport ->
                                    searchInitialSport = queryOrSport
                                    currentScreen = Screen.Search
                                },
                                onNavigateToPlay = { currentScreen = Screen.Play },
                                onNavigateToTrain = { currentScreen = Screen.Train },
                                onNavigateToDashboard = { currentScreen = Screen.Dashboard },
                                onShowMessage = ::showToast
                            )

                            is Screen.Search -> TrialsSearchScreen(
                                userState = userState,
                                initialSport = searchInitialSport,
                                onShowMessage = ::showToast
                            )

                            is Screen.Play -> PlayBookScreen(
                                userState = userState,
                                onShowMessage = ::showToast
                            )

                            is Screen.Train -> TrainEventsScreen(
                                userState = userState,
                                onShowMessage = ::showToast
                            )

                            is Screen.Dashboard -> DashboardScreen(
                                userState = userState,
                                onShowMessage = ::showToast
                            )
                        }
                    }
                }

                if (showWalletTopUp) {
                    WalletTopUpDialog(
                        userState = userState,
                        onDismiss = { showWalletTopUp = false },
                        onSuccess = { msg ->
                            showWalletTopUp = false
                            showToast(msg)
                        }
                    )
                }
            }
        }
    }
}
