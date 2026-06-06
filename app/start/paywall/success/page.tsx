import { MetaViewContent } from "@/features/meta";
import { CosmicLayout } from "@/features/start/cosmic-background";
import { PaywallSuccess } from "@/features/start/paywall/paywall-success";

export default function SuccessPage() {
  return (
    <CosmicLayout>
      <MetaViewContent pageName="paywall-success" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PaywallSuccess />
      </main>
    </CosmicLayout>
  );
}
