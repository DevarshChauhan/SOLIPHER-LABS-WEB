import { Hero } from "@/components/home/Hero";
import { ShardEvidenceHighlight } from "@/components/home/ShardEvidenceHighlight";
import { QuoteSlider } from "@/components/home/QuoteSlider";
import { RobotDeskScene } from "@/components/home/RobotDeskScene";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedResearch } from "@/components/home/FeaturedResearch";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CTABand } from "@/components/home/CTABand";
import { homeVariants, pickVariant } from "@/lib/copyVariants";

export const dynamic = "force-dynamic";

export default function Home() {
  const hero = pickVariant(homeVariants);
  return (
    <>
      <Hero lead={hero.lead} highlight={hero.highlight} description={hero.description} />
      <ShardEvidenceHighlight />
      <QuoteSlider />
      <RobotDeskScene />
      <StatsBar />
      <FeaturedResearch />
      <FeaturedProducts />
      <CTABand />
    </>
  );
}
