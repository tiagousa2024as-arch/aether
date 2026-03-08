import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { CommandDemo } from "@/components/landing/command-demo";
import { ProductExplanation } from "@/components/landing/product-explanation";
import { AgentSystem } from "@/components/landing/agent-system";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Pricing } from "@/components/landing/pricing";
import { Waitlist } from "@/components/landing/waitlist";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />
      <main>
        <Hero />
        <section id="features">
          <CommandDemo />
          <ProductExplanation />
        </section>
        <section id="agents">
          <AgentSystem />
        </section>
        <DashboardPreview />
        <section id="pricing">
          <Pricing />
        </section>
        <section id="waitlist">
          <Waitlist />
        </section>
        <Footer />
      </main>
    </div>
  );
}
