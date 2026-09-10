package com.khelgrid.app.ads

import android.app.Activity
import android.content.Context
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

/**
 * Google AdMob is the in-app equivalent of AdSense: AdSense units only run on
 * the website, apps must use AdMob. The IDs below are Google's official test
 * IDs, which are safe to ship in development. Replace them with the real
 * KhelGrid AdMob app ID and unit IDs (and the manifest meta-data value) once
 * the AdMob account is approved.
 */
object AdIds {
    /** Google test banner unit. */
    const val TEST_BANNER = "ca-app-pub-3940256099942544/9214589741"

    /** Banner shown above the bottom navigation bar on the main screens. */
    const val BOTTOM_BANNER = TEST_BANNER
}

private var initialised = false

/**
 * Ask for GDPR/consent first (Google's User Messaging Platform), then start the
 * ads SDK. No ad request is made before consent is resolved, which is what
 * Google's policy requires.
 */
fun initialiseAdsWithConsent(activity: Activity) {
    val consentInformation: ConsentInformation =
        UserMessagingPlatform.getConsentInformation(activity)

    val params = ConsentRequestParameters.Builder()
        .setTagForUnderAgeOfConsent(false)
        .build()

    consentInformation.requestConsentInfoUpdate(
        activity,
        params,
        {
            UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) {
                startSdk(activity)
            }
        },
        { startSdk(activity) },
    )

    if (consentInformation.canRequestAds()) startSdk(activity)
}

private fun startSdk(context: Context) {
    if (initialised) return
    initialised = true
    MobileAds.initialize(context) {}
}

/** Adaptive banner that fills the width of its container. */
@Composable
fun KhelGridBannerAd(
    adUnitId: String = AdIds.BOTTOM_BANNER,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    var canRequest by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        canRequest = UserMessagingPlatform.getConsentInformation(context).canRequestAds()
    }

    if (!canRequest) return

    Box(modifier = modifier.fillMaxWidth()) {
        AndroidView(
            modifier = Modifier.fillMaxWidth(),
            factory = { ctx ->
                AdView(ctx).apply {
                    setAdSize(AdSize.BANNER)
                    this.adUnitId = adUnitId
                    loadAd(AdRequest.Builder().build())
                }
            },
        )
    }
}
