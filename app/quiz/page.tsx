import type { Metadata } from "next";
import { SiteConfig } from "@/site-config";
import { QuizClient } from "@/features/quiz/quiz-client";

export const metadata: Metadata = {
  title: `Quiz — ${SiteConfig.title}`,
  description: SiteConfig.description,
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  return <QuizClient />;
}
