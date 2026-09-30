import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { TrialDetailsModal, getOrganizerContact, type OrganizerContact } from "./TrialDetailsModal";
import { TRIALS, type Trial } from "@/data/trials";

describe("TrialDetailsModal Component & Organizer Contact Resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleTrial: Trial = {
    id: "t-sikkim-test-1",
    title: "Fit India District Selection Trials (Namchi, Sikkim)",
    academy: "Sports & Youth Affairs Department, Government of Sikkim",
    sport: "Athletics",
    city: "Namchi",
    date: "Sep 23 - Sep 28, 2026",
    registrationDeadline: "Sep 28, 2026",
    fee: 0,
    spots: 120,
    tag: "Government Official",
    venue: "Bhaichung Stadium, Namchi Indoor Stadium, Namchi, Sikkim",
    eligibility: "Under-17 school students across Namchi district.",
    selectionProcess: "Competition-cum-selection trials observed by state coaches.",
    verifiedLabel: "Government of Sikkim Verified",
    urgencyText: "District Selection for State School Games Gangtok",
  };

  it("resolves specific organizer contact details for Government of Sikkim trial", () => {
    const contact = getOrganizerContact(sampleTrial);
    expect(contact.name).toBe("District Sports Officer (Namchi)");
    expect(contact.email).toContain("sikkim.gov.in");
    expect(contact.phone).toContain("3595");
    expect(contact.helpline).toBeDefined();
    expect(contact.address).toContain("Namchi");
  });

  it("resolves specific organizer contact details for Sports Authority of India (SAI) trial", () => {
    const saiTrial: Partial<Trial> = {
      academy: "Sports Authority of India (SAI) NCOE",
      city: "Mumbai",
    };
    const contact = getOrganizerContact(saiTrial);
    expect(contact.name).toContain("SAI NCOE");
    expect(contact.email).toContain("sai.gov.in");
    expect(contact.phone).toContain("2884");
  });

  it("renders modal with expanded venue location, organizer contact, and direct register button when open", () => {
    const html = renderToString(
      <TrialDetailsModal
        trial={sampleTrial}
        isOpen={true}
        inline={true}
        onClose={() => {}}
        isRegistered={false}
      />,
    );

    // Modal title & sport
    expect(html).toContain("Fit India District Selection Trials");
    expect(html).toContain("Athletics");
    expect(html).toContain("Namchi");
    expect(html).toContain("Free Entry (₹0)");

    // Expanded Venue Location section
    expect(html).toContain('id="modal-venue-location-section"');
    expect(html).toContain("Bhaichung Stadium");
    expect(html).toContain("View on Google Maps");

    // Expanded Organizer Contact section
    expect(html).toContain('id="modal-organizer-contact-section"');
    expect(html).toContain("District Sports Officer (Namchi)");
    expect(html).toContain("namchi.sports@sikkim.gov.in");
    expect(html).toContain("3595");

    // Eligibility & Selection criteria
    expect(html).toContain("Under-17 school students");
    expect(html).toContain("Competition-cum-selection trials");

    // Direct Register Button
    expect(html).toContain('id="btn-modal-register-trial"');
    expect(html).toContain("Register for Trial");

    // Share Toolbar & Controls
    expect(html).toContain('id="modal-share-toolbar"');
    expect(html).toContain('id="btn-modal-native-share"');
    expect(html).toContain("Share");
    expect(html).toContain('id="btn-modal-copy-link"');
    expect(html).toContain("Copy Link");
    expect(html).toContain('id="btn-modal-whatsapp-share"');

    // Advertisement & Sponsored Partner Section
    expect(html).toContain('id="modal-advertisement-section"');
    expect(html).toContain("Advertisement · Sponsored Equipment Partner");
    expect(html).toContain("KHELGRID20");
    expect(html).toContain("Exclusive Trial Discount");
    expect(html).toContain("Claim Offer");
    expect(html).toContain("Ad Choices");
  });

  it("renders 'Already Registered' state when isRegistered is true", () => {
    const html = renderToString(
      <TrialDetailsModal
        trial={sampleTrial}
        isOpen={true}
        inline={true}
        onClose={() => {}}
        isRegistered={true}
      />,
    );

    expect(html).toContain("Already Registered");
    expect(html).not.toContain("Register for Trial<");
  });

  it("returns null when trial is null", () => {
    const html = renderToString(
      <TrialDetailsModal trial={null} isOpen={true} onClose={() => {}} />,
    );
    expect(html).toBe("");
  });
});
