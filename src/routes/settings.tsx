import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, Bell, Lock, Eye, Palette, Sun, Moon, Monitor, Save, RotateCcw, ChevronRight, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

interface SettingsState {
  notifications: Record<string, boolean>;
  privacy: Record<string, boolean>;
  advertising: Record<string, boolean>;
  preferences: Record<string, string>;
}

function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "privacy" | "appearance">("account");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profilePublic: true,
      showActivity: false,
      allowMessages: true,
    },
    advertising: {
      personalized: true,
      trackingAllowed: true,
      targetedAds: true,
    },
    preferences: {
      theme: "auto",
      language: "en",
      emailFrequency: "weekly",
    },
  });

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      localStorage.setItem("theme", "auto");
    }
  }, [theme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "auto" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleSetting = (category: keyof SettingsState, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as Record<string, boolean>)[key],
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    setTheme("auto");
    setSettings({
      notifications: { email: true, sms: false, push: true },
      privacy: { profilePublic: true, showActivity: false, allowMessages: true },
      advertising: { personalized: true, trackingAllowed: true, targetedAds: true },
      preferences: { theme: "auto", language: "en", emailFrequency: "weekly" },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your account, notifications & preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-2">
              {[
                { id: "account", label: "Account", icon: "👤" },
                { id: "notifications", label: "Notifications", icon: "🔔" },
                { id: "privacy", label: "Privacy", icon: "🔒" },
                { id: "appearance", label: "Appearance", icon: "🎨" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block font-semibold text-slate-900 dark:text-white mb-3">Language</label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, language: e.target.value },
                          });
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-slate-700"
                      >
                        <option value="en">🇬🇧 English</option>
                        <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                        <option value="es">🇪🇸 Spanish (Español)</option>
                        <option value="fr">🇫🇷 French (Français)</option>
                      </select>
                    </div>

                    <div className="border-t pt-6" />
                    <div>
                      <label className="block font-semibold text-slate-900 dark:text-white mb-3">Email Frequency</label>
                      <select
                        value={settings.preferences.emailFrequency}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, emailFrequency: e.target.value },
                          });
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-slate-700"
                      >
                        <option value="daily">📅 Daily</option>
                        <option value="weekly">📆 Weekly</option>
                        <option value="monthly">📊 Monthly</option>
                        <option value="never">🚫 Never</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">Account Active</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Your account is in good standing</p>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Email Notifications</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Receive trial updates and recommendations</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={() => toggleSetting("notifications", "email")}
                    />
                  </div>

                  <div className="flex items-start justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex gap-3">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">Push Notifications</p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">Get real-time alerts on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={() => toggleSetting("notifications", "push")}
                    />
                  </div>

                  <div className="flex items-start justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex gap-3">
                      <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">SMS Notifications</p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">Get important updates via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={() => toggleSetting("notifications", "sms")}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile & Activity</CardTitle>
                    <CardDescription>Control your visibility and data sharing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Public Profile</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Allow others to view your profile and achievements</p>
                      </div>
                      <Switch
                        checked={settings.privacy.profilePublic}
                        onCheckedChange={() => toggleSetting("privacy", "profilePublic")}
                      />
                    </div>

                    <div className="border-t pt-6" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Show Activity</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Let others see your recent trial applications</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showActivity}
                        onCheckedChange={() => toggleSetting("privacy", "showActivity")}
                      />
                    </div>

                    <div className="border-t pt-6" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Allow Direct Messages</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive messages from coaches and organizers</p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowMessages}
                        onCheckedChange={() => toggleSetting("privacy", "allowMessages")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <CardTitle>Advertising Preferences</CardTitle>
                        <CardDescription>GDPR & Google Policy Compliant</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Personalized Ads</p>
                      <Switch
                        checked={settings.advertising.personalized}
                        onCheckedChange={() => toggleSetting("advertising", "personalized")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Allow Tracking</p>
                      <Switch
                        checked={settings.advertising.trackingAllowed}
                        onCheckedChange={() => toggleSetting("advertising", "trackingAllowed")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Targeted Ads</p>
                      <Switch
                        checked={settings.advertising.targetedAds}
                        onCheckedChange={() => toggleSetting("advertising", "targetedAds")}
                      />
                    </div>

                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      → Manage Google Ad Settings
                    </a>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Theme Selection</CardTitle>
                  <CardDescription>Choose your preferred appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Light Theme */}
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition ${
                        theme === "light"
                          ? "border-primary bg-primary/10"
                          : "border-border/60 bg-card/60 hover:border-border"
                      }`}
                    >
                      <Sun className="h-8 w-8 text-yellow-500 mb-3" />
                      <span className="font-semibold text-slate-900">Light</span>
                      <span className="text-xs text-slate-600 mt-1">Bright and clear</span>
                    </button>

                    {/* Dark Theme */}
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition ${
                        theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-border/60 bg-card/60 hover:border-border"
                      }`}
                    >
                      <Moon className="h-8 w-8 text-slate-700 mb-3" />
                      <span className="font-semibold text-slate-900">Dark</span>
                      <span className="text-xs text-slate-600 mt-1">Easy on eyes</span>
                    </button>

                    {/* Auto Theme */}
                    <button
                      onClick={() => setTheme("auto")}
                      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition ${
                        theme === "auto"
                          ? "border-primary bg-primary/10"
                          : "border-border/60 bg-card/60 hover:border-border"
                      }`}
                    >
                      <Monitor className="h-8 w-8 text-slate-500 mb-3" />
                      <span className="font-semibold text-slate-900">Auto</span>
                      <span className="text-xs text-slate-600 mt-1">System preference</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    💡 <strong>Tip:</strong> Auto mode will match your device's theme setting, automatically switching between light and dark based on your system preferences.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 sticky bottom-4">
              <Button
                onClick={handleSave}
                className="flex-1 gap-2"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
