import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, Bell, Lock, Eye, Palette, Sun, Moon, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
      // Auto: follow system preference
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
          </div>
          <p className="text-slate-600">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Control how you receive updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive trial updates and recommendations via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={() => toggleSetting("notifications", "email")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">SMS Notifications</p>
                  <p className="text-sm text-slate-600">Get important updates via text message</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={() => toggleSetting("notifications", "sms")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Push Notifications</p>
                  <p className="text-sm text-slate-600">Receive real-time alerts in your browser</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={() => toggleSetting("notifications", "push")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Privacy & Profile</CardTitle>
                  <CardDescription>Control your visibility and data sharing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Public Profile</p>
                  <p className="text-sm text-slate-600">Allow others to view your profile and achievements</p>
                </div>
                <Switch
                  checked={settings.privacy.profilePublic}
                  onCheckedChange={() => toggleSetting("privacy", "profilePublic")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Show Activity</p>
                  <p className="text-sm text-slate-600">Let others see your recent trial applications</p>
                </div>
                <Switch
                  checked={settings.privacy.showActivity}
                  onCheckedChange={() => toggleSetting("privacy", "showActivity")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Allow Direct Messages</p>
                  <p className="text-sm text-slate-600">Receive messages from coaches and organizers</p>
                </div>
                <Switch
                  checked={settings.privacy.allowMessages}
                  onCheckedChange={() => toggleSetting("privacy", "allowMessages")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advertising Settings - GDPR & Google Compliant */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-600" />
                <div>
                  <CardTitle>Advertising Preferences</CardTitle>
                  <CardDescription>
                    Control personalized advertising and tracking (GDPR & Google Policy Compliant)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Personalized Ads</p>
                  <p className="text-sm text-slate-600">See ads tailored to your interests and behavior</p>
                </div>
                <Switch
                  checked={settings.advertising.personalized}
                  onCheckedChange={() => toggleSetting("advertising", "personalized")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Allow Tracking</p>
                  <p className="text-sm text-slate-600">
                    Allow Google and advertising partners to track your activity for ad improvement
                  </p>
                </div>
                <Switch
                  checked={settings.advertising.trackingAllowed}
                  onCheckedChange={() => toggleSetting("advertising", "trackingAllowed")}
                />
              </div>
              <div className="border-t pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Targeted Ads</p>
                  <p className="text-sm text-slate-600">See sports-related ads from Google AdSense partners</p>
                </div>
                <Switch
                  checked={settings.advertising.targetedAds}
                  onCheckedChange={() => toggleSetting("advertising", "targetedAds")}
                />
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 mt-4">
                <p className="text-xs text-slate-600">
                  📌 <strong>Note:</strong> We use Google AdSense to serve relevant ads. You can manage your ad preferences at{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Ads Settings
                  </a>
                  . Your choices are compliant with GDPR, CCPA, and Google policies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize your app theme and display settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block font-medium text-slate-900 mb-4">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Light Theme */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "light"
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <Sun className="h-6 w-6 text-yellow-500 mb-2" />
                    <span className="text-sm font-medium text-slate-900">Light</span>
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "dark"
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <Moon className="h-6 w-6 text-slate-700 mb-2" />
                    <span className="text-sm font-medium text-slate-900">Dark</span>
                  </button>

                  {/* Auto Theme */}
                  <button
                    onClick={() => setTheme("auto")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "auto"
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <Monitor className="h-6 w-6 text-slate-500 mb-2" />
                    <span className="text-sm font-medium text-slate-900">Auto</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  💡 <strong>Auto:</strong> Follows your system's theme preference
                </p>
              </div>

              <div className="border-t pt-4" />
              <div>
                <label className="block font-medium text-slate-900 mb-2">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                </select>
              </div>
              <div className="border-t pt-4" />
              <div>
                <label className="block font-medium text-slate-900 mb-2">Email Frequency</label>
                <select
                  value={settings.preferences.emailFrequency}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, emailFrequency: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Data & Privacy Actions</CardTitle>
                  <CardDescription>Manage your personal data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                📥 Download Your Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔄 Request Data Correction
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                🗑️ Delete My Account
              </Button>
            </CardContent>
          </Card>

          {/* Legal Links */}
          <Card>
            <CardHeader>
              <CardTitle>Legal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="/privacy" className="block text-primary hover:underline">
                → Privacy Policy
              </a>
              <a href="/terms" className="block text-primary hover:underline">
                → Terms of Service
              </a>
              <a href="#" className="block text-primary hover:underline">
                → Cookie Policy
              </a>
              <a href="#" className="block text-primary hover:underline">
                → GDPR Compliance
              </a>
              <a href="#" className="block text-primary hover:underline">
                → Report a Problem
              </a>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="flex-1" size="lg">
              Save Changes
            </Button>
            <Button variant="outline" size="lg">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
