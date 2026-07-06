import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                KhelGrid ("we," "us," "our," or "Company") operates the website and mobile application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our digital properties.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information You Provide:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Name, email address, and phone number</li>
                  <li>Sports interests, skill level, and location data</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Profile information and photos</li>
                  <li>Communications with our support team</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Information Collected Automatically:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Browser type, IP address, and device information</li>
                  <li>Pages visited and time spent on our services</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Analytics data for service improvement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>To provide, maintain, and improve our Services</li>
                <li>To process transactions and send service-related announcements</li>
                <li>To personalize content and recommendations</li>
                <li>To respond to your inquiries and customer support requests</li>
                <li>For marketing purposes (with your consent)</li>
                <li>To comply with legal obligations and enforce agreements</li>
                <li>To display targeted advertisements through Google AdSense and other advertising networks</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Advertising & Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use Google AdSense and other advertising partners to serve ads on our website. These partners may use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Serve advertisements based on your prior visits</li>
                <li>Measure ad effectiveness and user engagement</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p className="text-sm font-semibold mt-4">
                Google's Privacy Policy: <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
              </p>
              <p className="text-sm font-semibold">
                Opt-out of personalized ads: <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Cookies & Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies, web beacons, and similar technologies to enhance your experience. You can control cookie preferences in your browser settings. Disabling cookies may affect some functionality.
              </p>
              <p className="text-sm">
                By using our Services, you consent to our use of cookies as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is completely secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights & Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Access:</strong> You may request access to your personal data</li>
                <li><strong>Correction:</strong> You can update or correct your information</li>
                <li><strong>Deletion:</strong> You may request deletion of your data (subject to legal obligations)</li>
                <li><strong>Marketing Communications:</strong> You can opt-out of promotional emails anytime</li>
                <li><strong>Cookies:</strong> Manage cookie preferences through browser settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. GDPR & International Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR). We only process your data with your explicit consent and ensure your rights are protected.
              </p>
              <p>
                <strong>Data Controller:</strong> KhelGrid, Mumbai, India
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this Privacy Policy or our practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> <a href="mailto:privacy@khelgrid.com" className="text-primary hover:underline">privacy@khelgrid.com</a></p>
                <p><strong>Address:</strong> KhelGrid, Mumbai, India</p>
                <p><strong>Phone:</strong> <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of our Services constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
