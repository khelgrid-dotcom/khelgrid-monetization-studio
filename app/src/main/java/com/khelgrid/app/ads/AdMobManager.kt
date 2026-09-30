package com.khelgrid.app.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration
import com.google.android.gms.ads.initialization.InitializationStatus
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

/**
 * Singleton manager to orchestrate Google Mobile Ads (AdMob) initialization,
 * banner ad creation with event listeners, and interstitial ad preloading, display,
 * and lifecycle event callbacks.
 */
class AdMobManager private constructor() {

    companion object {
        private const val TAG = "AdMobManager"

        /** Google official sample test ad unit IDs */
        const val TEST_BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/9214589741"
        const val TEST_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"

        @Volatile
        private var instance: AdMobManager? = null

        /**
         * Returns the thread-safe singleton instance of [AdMobManager].
         */
        @JvmStatic
        fun getInstance(): AdMobManager =
            instance ?: synchronized(this) {
                instance ?: AdMobManager().also { instance = it }
            }
    }

    /**
     * Listener interface for Banner ad lifecycle and user interaction events.
     */
    interface BannerAdListener {
        fun onAdLoaded() {}
        fun onAdFailedToLoad(loadAdError: LoadAdError) {}
        fun onAdOpened() {}
        fun onAdClicked() {}
        fun onAdClosed() {}
        fun onAdImpression() {}
    }

    /**
     * Listener interface for Interstitial ad loading, display, and dismissal events.
     */
    interface InterstitialAdListener {
        fun onAdLoaded(interstitialAd: InterstitialAd) {}
        fun onAdFailedToLoad(loadAdError: LoadAdError) {}
        fun onAdShowedFullScreenContent() {}
        fun onAdDismissedFullScreenContent() {}
        fun onAdFailedToShowFullScreenContent(adError: AdError) {}
        fun onAdImpression() {}
        fun onAdClicked() {}
    }

    // State tracking
    private var isInitialized = false
    private var isConsentRequested = false

    private var interstitialAd: InterstitialAd? = null
    private var isInterstitialLoading = false
    private var activeInterstitialUnitId: String? = null

    // Optional global listeners
    private var globalBannerListener: BannerAdListener? = null
    private var globalInterstitialListener: InterstitialAdListener? = null

    /**
     * Checks if the Google Mobile Ads SDK has been initialized.
     */
    fun isAdsInitialized(): Boolean = isInitialized

    /**
     * Checks if an interstitial ad is loaded and ready to be displayed.
     */
    fun isInterstitialAdReady(): Boolean = interstitialAd != null

    /**
     * Checks if an interstitial ad is currently in the process of loading.
     */
    fun isInterstitialAdLoading(): Boolean = isInterstitialLoading

    /**
     * Sets a global banner listener for app-wide event tracking/analytics.
     */
    fun setGlobalBannerListener(listener: BannerAdListener?) {
        this.globalBannerListener = listener
    }

    /**
     * Sets a global interstitial listener for app-wide event tracking/analytics.
     */
    fun setGlobalInterstitialListener(listener: InterstitialAdListener?) {
        this.globalInterstitialListener = listener
    }

    /**
     * Initialize Google Mobile Ads SDK with optional test device IDs and callback.
     *
     * @param context Application or Activity context
     * @param testDeviceIds Optional list of hashed test device IDs
     * @param onInitialized Optional callback invoked when SDK initialization completes
     */
    fun initialize(
        context: Context,
        testDeviceIds: List<String> = emptyList(),
        onInitialized: ((InitializationStatus) -> Unit)? = null
    ) {
        if (isInitialized) {
            Log.d(TAG, "AdMob SDK is already initialized.")
            return
        }

        if (testDeviceIds.isNotEmpty()) {
            val configuration = RequestConfiguration.Builder()
                .setTestDeviceIds(testDeviceIds)
                .build()
            MobileAds.setRequestConfiguration(configuration)
        }

        MobileAds.initialize(context) { status ->
            isInitialized = true
            Log.i(TAG, "AdMob SDK initialized successfully.")
            onInitialized?.invoke(status)
        }
    }

    /**
     * Handles GDPR / Google User Messaging Platform (UMP) consent flow first,
     * then initializes the AdMob SDK if and when consent allows ad requests.
     *
     * @param activity Hosting Activity to present consent forms if required
     * @param tagForUnderAgeOfConsent Set to true if targeting underage audience
     * @param onConsentResolved Callback with boolean flag indicating whether ads can be requested
     */
    fun initializeWithConsent(
        activity: Activity,
        tagForUnderAgeOfConsent: Boolean = false,
        onConsentResolved: ((canRequestAds: Boolean) -> Unit)? = null
    ) {
        val consentInformation: ConsentInformation =
            UserMessagingPlatform.getConsentInformation(activity)

        val params = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent)
            .build()

        isConsentRequested = true

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { formError ->
                    if (formError != null) {
                        Log.w(TAG, "Consent form error: ${formError.errorCode} - ${formError.message}")
                    }
                    val canRequest = consentInformation.canRequestAds()
                    if (canRequest) {
                        initialize(activity)
                    }
                    onConsentResolved?.invoke(canRequest)
                }
            },
            { requestConsentError ->
                Log.w(
                    TAG,
                    "Consent update failed: ${requestConsentError.errorCode} - ${requestConsentError.message}"
                )
                val canRequest = consentInformation.canRequestAds()
                if (canRequest) {
                    initialize(activity)
                }
                onConsentResolved?.invoke(canRequest)
            }
        )

        if (consentInformation.canRequestAds()) {
            initialize(activity)
        }
    }

    // =========================================================================
    // BANNER ADS
    // =========================================================================

    /**
     * Creates, configures, and returns an [AdView] with lifecycle event listeners attached.
     *
     * @param context Android context
     * @param adUnitId The AdMob Banner ad unit ID (defaults to test banner ID)
     * @param adSize The banner ad size, defaults to [AdSize.BANNER]
     * @param listener Optional event listener for this banner instance
     * @param autoLoad Whether to immediately execute [loadBannerAd]
     */
    fun createBannerAdView(
        context: Context,
        adUnitId: String = TEST_BANNER_AD_UNIT_ID,
        adSize: AdSize = AdSize.BANNER,
        listener: BannerAdListener? = null,
        autoLoad: Boolean = true
    ): AdView {
        val adView = AdView(context).apply {
            this.adUnitId = adUnitId
            setAdSize(adSize)
        }

        attachBannerEventListeners(adView, listener)

        if (autoLoad) {
            loadBannerAd(adView)
        }

        return adView
    }

    /**
     * Attaches an [AdListener] to handle banner ad events and forward them
     * to the provided [BannerAdListener] as well as the [globalBannerListener].
     */
    fun attachBannerEventListeners(adView: AdView, listener: BannerAdListener?) {
        adView.adListener = object : AdListener() {
            override fun onAdLoaded() {
                Log.d(TAG, "Banner ad loaded successfully: ${adView.adUnitId}")
                listener?.onAdLoaded()
                globalBannerListener?.onAdLoaded()
            }

            override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                Log.e(
                    TAG,
                    "Banner ad failed to load (${adView.adUnitId}): ${loadAdError.code} - ${loadAdError.message}"
                )
                listener?.onAdFailedToLoad(loadAdError)
                globalBannerListener?.onAdFailedToLoad(loadAdError)
            }

            override fun onAdOpened() {
                Log.d(TAG, "Banner ad opened: ${adView.adUnitId}")
                listener?.onAdOpened()
                globalBannerListener?.onAdOpened()
            }

            override fun onAdClicked() {
                Log.d(TAG, "Banner ad clicked: ${adView.adUnitId}")
                listener?.onAdClicked()
                globalBannerListener?.onAdClicked()
            }

            override fun onAdClosed() {
                Log.d(TAG, "Banner ad closed: ${adView.adUnitId}")
                listener?.onAdClosed()
                globalBannerListener?.onAdClosed()
            }

            override fun onAdImpression() {
                Log.d(TAG, "Banner ad recorded impression: ${adView.adUnitId}")
                listener?.onAdImpression()
                globalBannerListener?.onAdImpression()
            }
        }
    }

    /**
     * Loads an ad into the given [AdView].
     *
     * @param adView Target [AdView] to populate
     * @param adRequest Custom [AdRequest] or default builder
     */
    fun loadBannerAd(
        adView: AdView,
        adRequest: AdRequest = AdRequest.Builder().build()
    ) {
        adView.loadAd(adRequest)
    }

    /**
     * Destroys the [AdView] safely and releases underlying webview resources.
     */
    fun destroyBanner(adView: AdView?) {
        try {
            adView?.destroy()
        } catch (e: Exception) {
            Log.w(TAG, "Error destroying AdView: ${e.message}")
        }
    }

    // =========================================================================
    // INTERSTITIAL ADS
    // =========================================================================

    /**
     * Preloads an interstitial ad into memory with complete event listeners.
     *
     * @param context Application or Activity context
     * @param adUnitId The interstitial ad unit ID (defaults to test interstitial ID)
     * @param listener Optional [InterstitialAdListener] for loading events
     * @param adRequest Optional custom [AdRequest]
     */
    fun loadInterstitialAd(
        context: Context,
        adUnitId: String = TEST_INTERSTITIAL_AD_UNIT_ID,
        listener: InterstitialAdListener? = null,
        adRequest: AdRequest = AdRequest.Builder().build()
    ) {
        if (isInterstitialLoading) {
            Log.d(TAG, "Interstitial ad is already loading, skipping request.")
            return
        }

        if (interstitialAd != null && activeInterstitialUnitId == adUnitId) {
            Log.d(TAG, "Interstitial ad is already loaded and ready.")
            listener?.onAdLoaded(interstitialAd!!)
            return
        }

        isInterstitialLoading = true
        activeInterstitialUnitId = adUnitId
        Log.d(TAG, "Loading interstitial ad for unit: $adUnitId")

        InterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    isInterstitialLoading = false
                    Log.i(TAG, "Interstitial ad loaded successfully.")
                    listener?.onAdLoaded(ad)
                    globalInterstitialListener?.onAdLoaded(ad)
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialAd = null
                    isInterstitialLoading = false
                    Log.e(
                        TAG,
                        "Interstitial ad failed to load: ${loadAdError.code} - ${loadAdError.message}"
                    )
                    listener?.onAdFailedToLoad(loadAdError)
                    globalInterstitialListener?.onAdFailedToLoad(loadAdError)
                }
            }
        )
    }

    /**
     * Shows the preloaded interstitial ad if available.
     * Attaches [FullScreenContentCallback] to handle display, click, dismissal, and failure events.
     *
     * @param activity The hosting [Activity] in which to display the full-screen ad
     * @param listener Optional event listener for this display occurrence
     * @param autoReloadIfDismissed If true, automatically loads the next interstitial after dismissal
     * @return `true` if ad presentation started, `false` if no ad was ready to show
     */
    fun showInterstitialAd(
        activity: Activity,
        listener: InterstitialAdListener? = null,
        autoReloadIfDismissed: Boolean = true
    ): Boolean {
        val currentAd = interstitialAd
        if (currentAd == null) {
            Log.w(TAG, "showInterstitialAd called but no ad is loaded.")
            return false
        }

        currentAd.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdShowedFullScreenContent() {
                Log.d(TAG, "Interstitial ad showed full screen content.")
                listener?.onAdShowedFullScreenContent()
                globalInterstitialListener?.onAdShowedFullScreenContent()
            }

            override fun onAdDismissedFullScreenContent() {
                Log.d(TAG, "Interstitial ad dismissed by user.")
                interstitialAd = null
                listener?.onAdDismissedFullScreenContent()
                globalInterstitialListener?.onAdDismissedFullScreenContent()

                if (autoReloadIfDismissed) {
                    val unitId = activeInterstitialUnitId ?: TEST_INTERSTITIAL_AD_UNIT_ID
                    loadInterstitialAd(activity, unitId)
                }
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.e(
                    TAG,
                    "Interstitial ad failed to show: ${adError.code} - ${adError.message}"
                )
                interstitialAd = null
                listener?.onAdFailedToShowFullScreenContent(adError)
                globalInterstitialListener?.onAdFailedToShowFullScreenContent(adError)

                if (autoReloadIfDismissed) {
                    val unitId = activeInterstitialUnitId ?: TEST_INTERSTITIAL_AD_UNIT_ID
                    loadInterstitialAd(activity, unitId)
                }
            }

            override fun onAdImpression() {
                Log.d(TAG, "Interstitial ad recorded impression.")
                listener?.onAdImpression()
                globalInterstitialListener?.onAdImpression()
            }

            override fun onAdClicked() {
                Log.d(TAG, "Interstitial ad clicked.")
                listener?.onAdClicked()
                globalInterstitialListener?.onAdClicked()
            }
        }

        currentAd.show(activity)
        return true
    }

    /**
     * Clears any currently cached interstitial ad.
     */
    fun clearInterstitialAd() {
        interstitialAd = null
        isInterstitialLoading = false
        activeInterstitialUnitId = null
    }
}
