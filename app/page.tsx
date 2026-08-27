import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { TrustStatement } from "@/components/landing/trust-statement";
import { HowItWorks } from "@/components/landing/how-it-works";
import { OpportunityPreview } from "@/components/landing/opportunity-preview";
import { ReadinessPreview } from "@/components/landing/readiness-preview";
import { Categories } from "@/components/landing/categories";
import { Benefits } from "@/components/landing/benefits";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStatement />
        <HowItWorks />
        <OpportunityPreview />
        <ReadinessPreview />
        <Categories />
        <Benefits />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
