import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sendIcon from "../../assets/icons/sendIcon.svg";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const leftSideRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const formRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Left side - slide in from left
    gsap.fromTo(
      leftSideRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Heading - fade in and scale
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Paragraph - fade in from bottom
    gsap.fromTo(
      paragraphRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "top 42%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Form - slide up and fade
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Video - slide in from right and rotate
    gsap.fromTo(
      videoRef.current,
      { opacity: 0, x: 60, rotationY: -20 },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: false,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 flex items-center justify-center"
    >
      {/* Outer Wrapper */}
      <div className="w-full max-w-6xl px-4">
        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-lg">
          {/* LEFT SIDE */}
          <div
            ref={leftSideRef}
            className="w-full lg:w-1/2 bg-[#AD5E5C] text-white px-8 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center"
          >
            <h2
              ref={headingRef}
              className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-snug lg:leading-[46px]"
            >
              Let taltula Guide Your Glow, Join taltula’s Clinic
            </h2>

            <p
              ref={paragraphRef}
              className="text-sm sm:text-base mt-4 mb-8 text-white/90 max-w-md"
            >
              Receive personalized beauty insights, routine tips, and curated
              iHerb picks straight to your inbox.
            </p>

            <form
              ref={formRef}
              className="flex md:flex-row flex-col w-full gap-2 max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-white text-[#AD5E5C] placeholder-gray-500 focus:outline-none text-sm sm:text-base shadow-sm"
              />

              <button
                type="submit"
                className="bg-white rounded-xl px-5 py-3 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <img src={sendIcon} alt="Send" className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div
            ref={videoRef}
            className="hidden lg:flex w-full lg:w-1/2 bg-white items-center justify-center p-10"
            style={{ perspective: "1000px" }}
          >
            {/* <img
              src={chooseImg}
              alt="taltula Cat"
              className="max-h-[320px] object-contain"
            /> */}
            <video
              autoPlay
              loop
              muted
              playsInline
              src="/white-transparent.mp4"
              className="max-h-[320px] object-contain"
            ></video>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
