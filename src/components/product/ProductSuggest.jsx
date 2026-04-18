import React, { useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 
import cartIcon from "../../assets/icons/cart.svg";
import invoiceIcon from "../../assets/icons/invoice.svg";
import ShareButton from "../common/ShareButton";

import rice from "../../assets/clinic/rice.jpg"
import roller from "../../assets/clinic/roller.jpg"
import mask from "../../assets/clinic/mask.jpg"



gsap.registerPlugin(ScrollTrigger);

const defaultRoutine = [
  {
    id: "prep",
    stepLabel: "STEP 1 : PREP",
    name: "Gentle Rice Toner",
    description: '"Start here. The rice extract creates a hydrated canvas."',
    price: "$18.00",
    image:
      rice,
    ctaLabel: "Find on iHerb",
  },
  {
    id: "treat",
    stepLabel: "STEP 2 : TREAT",
    name: "Snail Mucin Essence",
    description: '"Your skin worker. Repairs the barrier while you sleep."',
    price: "$24.00",
    image:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=360&q=80",
    ctaLabel: "Find on iHerb",
  },
  {
    id: "seal",
    stepLabel: "STEP 3 : SEAL",
    name: "Centella Calming Cream",
    description: '"Lock it all in. Centella calms any residual redness."',
    price: "$22.00",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=360&q=80",
    ctaLabel: "Find on iHerb",
  },
  {
    id: "renew",
    stepLabel: "STEP 4 : RENEW",
    name: "Retinol 0.5% Oil",
    description: '"Gentle entry into retinoids. Use only at night."',
    price: "$15.00",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=360&q=80",
    ctaLabel: "Find on iHerb",
  },
];

const defaultExtras = [
  {
    id: "sleep-mask",
    name: "Silk Sleep Mask",
    description: "For that true under-eye style.",
    price: "$45.00",
    image:
      mask,
  },
  {
    id: "roller",
    name: "Rose Quartz Roller",
    description: "De-puffing magic for early mornings.",
    price: "$15.00",
    image:
      roller,
  },
  {
    id: "sleeping-mask",
    name: "Lip Sleeping Mask",
    description: "Wake up with one-petal lips.",
    price: "$19.00",
    image:
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=360&q=80",
  },
];

const normalizeRoutine = (routine = []) =>
  routine.map((item, index) => ({
    id: item.id ?? `routine-${index + 1}`,
    stepLabel: item.stepLabel ?? `STEP ${index + 1}`,
    name: item.name ?? "Unnamed Product",
    description: item.description ?? item.desc ?? "",
    price: item.price ?? "",
    image: item.image ?? "",
    ctaLabel: item.ctaLabel ?? "Find on Herb",
  }));

const normalizeExtras = (extras = []) =>
  extras.map((item, index) => ({
    id: item.id ?? `extra-${index + 1}`,
    name: item.name ?? "Extra",
    description: item.description ?? "",
    price: item.price ?? "",
    image: item.image ?? "",
  }));

function ProductSuggest({
  routine = [],
  extras = [],
  title = "Your Routine for General Glow",
  subtitle = `I've curated this routine to specifically target your concerns. We're focusing on rebuilding the barrier first, then adding the glow. Consistency is your new best friend.`,
  consultation = {},
}) {
  const sectionRef = useRef(null);
  const asideRef = useRef(null);
  const headerRef = useRef(null);
  const routineContainerRef = useRef(null);
  const extrasRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const consultationNameRef = useRef(null);
  const onlineLabelRef = useRef(null);

  const routineItems = useMemo(
    () => normalizeRoutine(routine.length ? routine : defaultRoutine),
    [routine],
  );
  const extraItems = useMemo(
    () => normalizeExtras(extras.length ? extras : defaultExtras),
    [extras],
  );

  const circle1 = useRef(null);
  const circle2 = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(circle1.current, {
      scale: 1.2,
      opacity: 0.4,
      duration: 2,
      ease: "power1.out",
    })
      .to(circle1.current, {
        scale: 1,
        opacity: 1,
        duration: 0,
      })

      .to(
        circle2.current,
        {
          scale: 1.25,
          opacity: 0.4,
          duration: 2,
          ease: "power1.out",
        },
        "-=1.5",
      )
      .to(circle2.current, {
        scale: 1,
        opacity: 1,
        duration: 0,
      });
  }, []);

  useEffect(() => {
    // Animate aside/left section
    gsap.fromTo(
      asideRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Animate header section
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
          markers: false,
        },
      },
    );

    // Animate routine items with advanced stagger
    if (routineContainerRef.current) {
      const items = routineContainerRef.current.querySelectorAll("article");
      gsap.fromTo(
        items,
        { opacity: 0, y: 50, scale: 0.95, rotateX: -10 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: {
            amount: 0.6,
            from: "start",
            ease: "power2.inOut",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: routineContainerRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
            markers: false,
          },
        },
      );

      // Add individual article hover effects
      items.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            y: -5,
            boxShadow: "0 15px 35px rgba(90, 43, 66, 0.15)",
            duration: 0.3,
            overwrite: "auto",
          });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            y: 0,
            boxShadow: "0 7px 18px rgba(90, 43, 66, 0.06)",
            duration: 0.3,
            overwrite: "auto",
          });
        });
      });
    }

    // Animate consultation name & online label
    gsap.fromTo(
      consultationNameRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 40%",
          scrub: 0.5,
          markers: false,
        },
      },
    );

    gsap.fromTo(
      onlineLabelRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 45%",
          scrub: 0.5,
          markers: false,
        },
      },
    );

    // Animate title with advanced effects (fade, slide, scale, and color)
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
          letterSpacing: "8px",
          color: "#a39caa",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          letterSpacing: "0px",
          color: "#7d0f31",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 35%",
            scrub: 1.2,
            markers: false,
          },
        },
      );

      // Add line-through effect on title hover
      titleRef.current.addEventListener("mouseenter", () => {
        gsap.to(titleRef.current, {
          textDecoration: "underline",
          textDecorationThickness: "2px",
          textUnderlineOffset: "8px",
          duration: 0.4,
          overwrite: "auto",
        });
      });

      titleRef.current.addEventListener("mouseleave", () => {
        gsap.to(titleRef.current, {
          textDecoration: "none",
          duration: 0.4,
          overwrite: "auto",
        });
      });
    }

    // Animate subtitle with enhanced effects (blur, slide, gradient)
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
            end: "top 32%",
            scrub: 1.2,
            markers: false,
          },
        },
      );

      // Add glow effect on hover
      subtitleRef.current.addEventListener("mouseenter", () => {
        gsap.to(subtitleRef.current, {
          color: "#8d8794",
          textShadow: "0 0 10px rgba(139, 135, 148, 0.3)",
          duration: 0.3,
          overwrite: "auto",
        });
      });

      subtitleRef.current.addEventListener("mouseleave", () => {
        gsap.to(subtitleRef.current, {
          color: "#a39caa",
          textShadow: "none",
          duration: 0.3,
          overwrite: "auto",
        });
      });
    }

    // Animate extras section title
    const extrasTitleElement = document.querySelector(
      "section h2.text-center.font-playfair",
    );
    if (extrasTitleElement) {
      gsap.fromTo(
        extrasTitleElement,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out",
          scrollTrigger: {
            trigger: extrasRef.current,
            start: "top 90%",
            end: "top 50%",
            scrub: 1,
            markers: false,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const consultationName = consultation.title ?? "TALTULA CONSULTATION";
  const onlineLabel = consultation.onlineLabel ?? "Talula is Online";
  const isOnline = consultation.isOnline ?? true;
  // const heroImage = consultation.heroImage ?? chooseCat;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen  px-4 py-6 sm:px-6 lg:px-8 bg-[#fffefe]"
    >
      <div className="mx-auto grid w-full max-w-2xl overflow-hidden rounded-[24px]   lg:grid-cols-2">
        <aside
          ref={asideRef}
          className="flex flex-col border-b border-[#f2e8ee] bg-[#fffdfd] lg:border-b-0 lg:border-r"
        >
          <div className="mx-auto w-full max-w-[560px] px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex items-center gap-2 text-[13px] text-[#6a6a73]">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-[#71cf46]" : "bg-[#9da3aa]"
                }`}
              />
              <span ref={onlineLabelRef}>{onlineLabel}</span>
            </div>
            <h2
              ref={consultationNameRef}
              className="mt-3 text-[30px] font-semibold leading-none tracking-tight text-[#60336f] sm:text-[33px]"
            >
              {consultationName}
            </h2>
          </div>
          <div className="h-px bg-[#f0e4ea]" />

          <div className="relative grid min-h-[520px] place-items-center px-6 py-10 sm:px-10">
            <div
              ref={circle1}
              className="absolute h-[300px] w-[300px] rounded-full border border-[#f3dde4]/90 sm:h-[332px] sm:w-[332px]"
            />

            <div
              ref={circle2}
              className="absolute h-[238px] w-[238px] rounded-full border border-[#f6e6eb]/95 sm:h-[268px] sm:w-[268px]"
            />
            {/* <img
              src={heroImage}
              alt="Talula mascot"
              className="relative z-10 h-auto md:h-[726px] md:w-[726px] w-[230px] drop-shadow-[0_16px_30px_rgba(111,53,83,0.2)] "
            /> */}

            <video
              autoPlay
              loop
              muted
              playsInline
              src="/products.webm"
              className="relative z-10 h-auto md:h-[726px] md:w-[726px] w-[230px] drop-shadow-[0_16px_30px_rgba(111,53,83,0.2)] "
            ></video>
          </div>
        </aside>

        <div className="flex flex-col px-4 py-7 sm:px-8 sm:py-9 lg:px-10 ">
          <div className="mx-auto w-full max-w-[560px]">
            <header ref={headerRef} className="text-center">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="bg-[#4D0218] w-12 h-12 rounded-full flex items-center justify-center">
                  <img
                    src={invoiceIcon}
                    alt="invoice icon"
                    className="h-5 w-5 "
                  />
                </div>
                <ShareButton
                  label="Share Plan"
                  title="My Taltula Prescription"
                  message={`My luxury routine from Taltula: ${title}`}
                  url="/products"
                />
              </div>

              <h1
                ref={titleRef}
                className="font-playfair text-[33px] font-semibold leading-tight text-[#7d0f31] sm:text-[39px]"
              >
                {title}
              </h1>
              <p
                ref={subtitleRef}
                className="mx-auto mt-3 max-w-[510px] text-[13px] leading-[1.45] text-[#a39caa] sm:text-[14px]"
              >
                {subtitle}
              </p>
            </header>

            <div
              ref={routineContainerRef}
              className="relative mt-8 sm:mt-10 sm:pl-9"
            >
              <span className="absolute bottom-7 left-[18px] top-7 hidden w-px bg-[#f2dce4] sm:block" />
              <div className="space-y-5 sm:space-y-6">
                {routineItems.map((item, index) => (
                  <article key={item.id} className="relative">
                    <span className="absolute left-[-34px] top-10 hidden h-8 w-8 place-items-center rounded-full border border-[#ebd2da] bg-white text-sm font-semibold text-[#bc6b80] sm:grid">
                      {index + 1}
                    </span>
                    <div className="rounded-[16px] border border-[#f0dde5] bg-white p-4 shadow-[0_7px_18px_rgba(90,43,66,0.06)] sm:p-5">
                      <div className="flex gap-3 sm:gap-5">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dd8ca2]">
                            {item.stepLabel}
                          </p>
                          <h3 className="mt-1.5 font-playfair text-[24px] font-semibold leading-tight text-[#771536] sm:text-[27px]">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-[12px] leading-[1.45] text-[#8d8794] sm:text-[13px]">
                            {item.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2.5">
                            <span className="text-[13px] font-semibold text-[#8f2040]">
                              {item.price}
                            </span>
                            <button
                              type="button"
                              className="rounded-full bg-[#b15f66] px-4 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#9f4e55]"
                            >
                              {item.ctaLabel}
                            </button>
                          </div>
                        </div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[94px] w-[94px] rounded-xl border border-[#f0e4e8] object-cover sm:h-[104px] sm:w-[104px]"
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="my-9 h-px bg-[#f2e3ea]" />

            <section ref={extrasRef}>
              <h2 className="text-center font-playfair text-[28px] font-semibold text-[#7a1132] sm:text-[31px]">
                Talula&apos;s Pampering Extras
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {extraItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[14px] border border-[#f0dde5] bg-white p-2 shadow-[0_7px_18px_rgba(90,43,66,0.05)]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[132px] w-full rounded-[10px] object-cover"
                    />
                    <div className="px-1 pb-1 pt-3">
                      <h3 className="font-playfair text-[22px] font-semibold leading-tight text-[#771536]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-[12px] text-[#8f8998]">
                        {item.description}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#8f2040]">
                          {item.price}
                        </span>
                        <span className="rounded-full border bg-[#FFF1F2] border-[#f0d9e2] p-1.5 text-[#d47793]">
                          <img
                            src={cartIcon}
                            alt="cart icon"
                            className="h-[14px] w-[14px]"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSuggest;
