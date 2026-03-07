import { useEffect, useRef } from "react";
import gsap from "gsap";

function Hero() {
  const videoRef = useRef(null);
  const textBoxRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Create a timeline for coordinated animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate video - fade in and slide from left
    tl.fromTo(
      videoRef.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1 },
      0,
    );

    // Animate text box - fade in and slide from right with scale
    tl.fromTo(
      textBoxRef.current,
      { opacity: 0, x: 100, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 1 },
      0.2,
    );

    // Animate title text - letter-by-letter effect
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.4,
    );

    // Add a subtle hover animation effect
    const handleHover = () => {
      gsap.to(textBoxRef.current, {
        boxShadow:
          "0 10px 30px rgba(255, 192, 203, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    };

    const handleHoverEnd = () => {
      gsap.to(textBoxRef.current, {
        boxShadow:
          "0 1.679px 5.038px rgba(0, 0, 0, 0.1), 0 1.679px 3.359px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    };

    textBoxRef.current?.addEventListener("mouseenter", handleHover);
    textBoxRef.current?.addEventListener("mouseleave", handleHoverEnd);

    return () => {
      textBoxRef.current?.removeEventListener("mouseenter", handleHover);
      textBoxRef.current?.removeEventListener("mouseleave", handleHoverEnd);
    };
  }, []);

  return (
    <section className="w-full flex items-center justify-center py-8">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row justify-between items-center w-full max-w-7xl mx-auto px-4 gap-8">
        <div ref={videoRef} className="flex-shrink-0 w-full md:w-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/welcome-bg-removed.webm"
            className="w-full max-w-[707px] aspect-square object-cover "
          ></video>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[645px]">
          <div
            ref={textBoxRef}
            className="text-center md:text-left max-w-xl rounded-[40.305px_40.305px_40.305px_0] border border-[#FFE4E6] bg-white shadow-[0_1.679px_5.038px_0_rgba(0,0,0,0.10),0_1.679px_3.359px_-1.679px_rgba(0,0,0,0.10)] p-6 md:p-14 transition-shadow"
          >
            <h1
              ref={titleRef}
              className="text-[#4D0218] font-['Playfair_Display'] text-2xl md:text-[33.588px] italic font-normal leading-normal md:leading-[54.58px]"
            >
              Welcome back, gorgeous. You are so lucky I am in such a generous
              mood today—I am ready to make you glow.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
