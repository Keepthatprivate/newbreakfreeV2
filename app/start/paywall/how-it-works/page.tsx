import { MetaViewContent } from "@/features/meta";
import { CosmicLayout } from "@/features/start/cosmic-background";
import { PaywallStep2 } from "@/features/start/paywall/paywall-step2";

export default function HowItWorksPage() {
  return (
    <CosmicLayout>
      <MetaViewContent pageName="paywall-how-it-works" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PaywallStep2 />
      </main>
    </CosmicLayout>
  );
}
