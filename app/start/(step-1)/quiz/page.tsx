import { MetaViewContent } from "@/features/meta";
import { CosmicLayout } from "@/features/start/cosmic-background";
import { QuizForm } from "@/features/start/quiz/quiz-form";

export default function QuizPage() {
  return (
    <CosmicLayout>
      <MetaViewContent pageName="start-quiz" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <QuizForm />
      </main>
    </CosmicLayout>
  );
}
