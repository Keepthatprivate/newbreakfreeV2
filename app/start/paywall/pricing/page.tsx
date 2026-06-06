import { MetaViewContent } from "@/features/meta";
import { CosmicLayout } from "@/features/start/cosmic-background";
import { PaywallStep3 } from "@/features/start/paywall/paywall-step3";

export default function PricingPage() {
  return (
    <CosmicLayout>
      <MetaViewContent pageName="paywall-pricing" value={9.99} currency="EUR" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PaywallStep3 />
      </main>
    </CosmicLayout>
  );
}
