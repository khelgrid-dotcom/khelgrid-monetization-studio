import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HOME_FAQ_ITEMS, type FAQItem } from "@/data/home-faq";
import { HelpCircle, IndianRupee, ShieldCheck, Laptop, ArrowRight } from "lucide-react";

export function HomeFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "monetization", label: "Monetization & Plans", icon: IndianRupee },
    { id: "platform", label: "Platform & CV", icon: Laptop },
    { id: "verification", label: "Verification & Safety", icon: ShieldCheck },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? HOME_FAQ_ITEMS
      : HOME_FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="mx-auto mt-14 max-w-5xl rounded-3xl border border-border/80 bg-gradient-card p-6 shadow-sm sm:p-10"
    >
      <div className="flex flex-col gap-3 text-center sm:items-center">
        <div className="inline-flex items-center gap-2 self-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2
          id="faq-section-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Got questions? We have answers.
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Learn about our transparent monetization, trial micropayments, academy sponsorship, and
          how athletes get discovered.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter frequently asked questions by topic"
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="faq-accordion-container"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20"
                  : "border border-border/80 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div id="faq-accordion-container" className="mt-8">
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-free-vs-paid"
          className="w-full divide-y divide-border/60"
        >
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-border/60 py-1 transition-colors hover:bg-muted/20 px-2 rounded-lg"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground text-sm sm:text-base hover:no-underline hover:text-primary">
                <span className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pl-5 pr-2 pt-1 pb-4">
                <p>{faq.answer}</p>
                {faq.link && (
                  <div className="mt-3">
                    <Link
                      to={faq.link.to}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>{faq.link.text}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Direct Contact & Support Callout */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Have a specific question?</h3>
          <p className="text-xs text-muted-foreground">
            Our athlete support and academy advisory teams are here to guide you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="default" className="text-xs">
            <Link to="/pricing">Explore Pricing Plans</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link to="/trust-center">Trust Center</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
