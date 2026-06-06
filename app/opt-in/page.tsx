import { CosmicLayout } from "@/features/start/cosmic-background";
import { OptInForm } from "@/features/start/opt-in/opt-in-form";

export default function OptInPage() {
  return (
    <CosmicLayout>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <OptInForm />
      </main>
    </CosmicLayout>
  );
}
