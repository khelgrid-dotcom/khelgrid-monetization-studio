package com.khelgrid.app.ads

import android.app.Activity
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
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
    const val TEST_BANNER = AdMobManager.TEST_BANNER_AD_UNIT_ID

    /** Google test interstitial unit. */
    const val TEST_INTERSTITIAL = AdMobManager.TEST_INTERSTITIAL_AD_UNIT_ID

    /** Banner shown above the bottom navigation bar on the main screens. */
    const val BOTTOM_BANNER = TEST_BANNER
}

/**
 * Ask for GDPR/consent first (Google's User Messaging Platform), then start the
 * ads SDK via [AdMobManager]. No ad request is made before consent is resolved,
 * which is what Google's policy requires.
 */
fun initialiseAdsWithConsent(activity: Activity) {
    AdMobManager.getInstance().initializeWithConsent(activity)
}

/**
 * Adaptive banner that fills the width of its container, utilizing [AdMobManager]
 * for ad creation, lifecycle event listeners, and safe disposal.
 */
@Composable
fun KhelGridBannerAd(
    adUnitId: String = AdIds.BOTTOM_BANNER,
    adSize: AdSize = AdSize.BANNER,
    listener: AdMobManager.BannerAdListener? = null,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    var canRequest by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        canRequest = UserMessagingPlatform.getConsentInformation(context).canRequestAds()
    }

    if (!canRequest) return

    var adViewInstance by remember { mutableStateOf<AdView?>(null) }

    DisposableEffect(adUnitId) {
        onDispose {
            AdMobManager.getInstance().destroyBanner(adViewInstance)
            adViewInstance = null
        }
    }

    Box(modifier = modifier.fillMaxWidth()) {
        AndroidView(
            modifier = Modifier.fillMaxWidth(),
            factory = { ctx ->
                AdMobManager.getInstance().createBannerAdView(
                    context = ctx,
                    adUnitId = adUnitId,
                    adSize = adSize,
                    listener = listener,
                    autoLoad = true
                ).also { adViewInstance = it }
            },
        )
    }
}
