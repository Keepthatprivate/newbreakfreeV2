import { MetaViewContent } from "@/features/meta";
import { CosmicLayout } from "@/features/start/cosmic-background";
import { PaywallStep1 } from "@/features/start/paywall/paywall-step1";

export default function PaywallPage() {
  return (
    <CosmicLayout>
      <MetaViewContent pageName="paywall-step1" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PaywallStep1 />
      </main>
    </CosmicLayout>
  );
}
