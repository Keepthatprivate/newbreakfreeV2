import { AdvisorsSection } from "@/features/landing/advisors-section";
import { FAQSection } from "@/features/landing/faq-section";
import { FeaturesGrid } from "@/features/landing/features-grid";
import { HeroAstro } from "@/features/landing/hero-astro";
import { HowItWorks } from "@/features/landing/how-it-works";
import { SectionDivider } from "@/features/landing/section-divider";
import { Footer } from "@/features/layout/footer";
import { MetaViewContent } from "@/features/meta";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <MetaViewContent pageName="landing" />
      <HeroAstro />

      <FeaturesGrid />

      <SectionDivider />

      <AdvisorsSection />

      <SectionDivider />

      <HowItWorks />

      <SectionDivider />

      <FAQSection
        faq={[
          {
            question: "What is BoilerSaaS?",
            answer:
              "Astarlena is an all-in-one astrology platform offering personalized readings and horoscopes based on your birth chart data. We use advanced algorithms combined with traditional astrological wisdom to provide accurate insights.",
          },
          {
            question: "How accurate are the readings?",
            answer:
              "Our readings are based on precise astronomical calculations and traditional astrological interpretations. While astrology is a tool for self-reflection rather than prediction, our users report a 97.2% satisfaction rate with the relevance of their readings.",
          },
          {
            question: "What information do I need to get started?",
            answer:
              "To receive the most accurate readings, we need your date of birth, time of birth (if known), and place of birth. This allows us to calculate your exact birth chart and provide personalized insights.",
          },
          {
            question: "Can I consult with a real astrologer?",
            answer:
              "Yes! We have a team of experienced astrologers available for personal consultations. You can book a session directly through the platform and receive one-on-one guidance.",
          },
          {
            question: "Is my data secure?",
            answer:
              "Absolutely. We take data privacy seriously and use industry-standard encryption to protect your personal information. We never share your data with third parties without your consent.",
          },
          {
            question: "What types of readings do you offer?",
            answer:
              "We offer a wide range of readings including daily horoscopes, birth chart analysis, compatibility readings, tarot readings, palm reading interpretations, and career guidance based on your astrological profile.",
          },
        ]}
      />

      <SectionDivider />

      <Footer />
    </div>
  );
}
