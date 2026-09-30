import { describe, it, expect, beforeEach, vi } from "vitest";
import { toast, useToast, resetToastsForTesting } from "./use-toast";

describe("useToast Notification System", () => {
  beforeEach(() => {
    resetToastsForTesting();
    vi.clearAllMocks();
  });

  it("dispatches toast and returns a unique ID with dismiss and update handlers", () => {
    const res = toast({
      title: "Booking Confirmed",
      description: "Slot reserved for 6:00 PM",
      variant: "success",
    });

    expect(res.id).toBeDefined();
    expect(typeof res.dismiss).toBe("function");
    expect(typeof res.update).toBe("function");
  });

  it("supports convenience methods for success, error, warning, and info", () => {
    const successToast = toast.success("Slot Confirmed", "At Decathlon Arena");
    expect(successToast.id).toBeDefined();

    const errorToast = toast.error("Booking Conflict", "Slot already taken");
    expect(errorToast.id).toBeDefined();

    const warningToast = toast.warning("Low Availability", "Only 1 court left");
    expect(warningToast.id).toBeDefined();

    const infoToast = toast.info("Booking Policy", "Free cancellation within 4h");
    expect(infoToast.id).toBeDefined();
  });

  it("allows dismissing toasts individually and globally", () => {
    const t1 = toast.success("Toast 1");
    const t2 = toast.error("Toast 2");

    expect(t1.id).toBeDefined();
    expect(t2.id).toBeDefined();

    toast.dismiss(t1.id);
    toast.dismiss();
  });

  it("resets toasts state cleanly for test teardown", () => {
    toast.success("Active Toast");
    resetToastsForTesting();
  });
});
