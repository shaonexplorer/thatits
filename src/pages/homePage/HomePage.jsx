import bgImg from "../../assets/images/homebg.png";
import Hero from "../../components/home/Hero";
import Home from "../../components/home/Home";
import ShareButton from "../../components/common/ShareButton";

function HomePage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-6 pb-10 md:pt-8 overflow-hidden">
      {/* Using an img tag instead of CSS background-image 
         allows the browser to discover the image faster and 
         apply 'fetchpriority' for better LCP.
      */}
      <img
        src={bgImg}
        alt=""
        // Use fetchpriority="high" for hero backgrounds (Chrome 101+)
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
      />

      <div className="relative z-40 w-full">
        <ShareButton className="absolute max-w-2xl lg:top-10 md:top-6 top-2 lg:right-60 md:right-40 right-4" />

        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-12 md:gap-16 py-4 md:py-8">
          <Hero />
          <Home />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
