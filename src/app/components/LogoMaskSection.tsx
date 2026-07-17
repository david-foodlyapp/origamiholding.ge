import React, { CSSProperties, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";

export function LogoMaskSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isKa = i18n.language === "ka";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 35%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const logoScale = shouldReduceMotion
    ? useTransform(smoothProgress, [0, 1], [1, 1])
    : useTransform(smoothProgress, [0, 0.34, 1], [0.28, 0.72, 3.4]);
  const logoX = useTransform(smoothProgress, [0, 1], [0, 0]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.12, 0.45, 1], [0.62, 0.88, 1, 1]);
  const logoY = shouldReduceMotion
    ? useTransform(smoothProgress, [0, 1], [0, 0])
    : useTransform(smoothProgress, [0, 0.42, 1], [182, 72, -18]);
  const cardScale = shouldReduceMotion
    ? useTransform(smoothProgress, [0, 1], [1, 1])
    : useTransform(smoothProgress, [0, 1], [0.992, 1]);
  const backgroundY = shouldReduceMotion
    ? useTransform(smoothProgress, [0, 1], ["0%", "0%"])
    : useTransform(smoothProgress, [0, 1], ["-2%", "6%"]);
  const backgroundScale = shouldReduceMotion
    ? useTransform(smoothProgress, [0, 1], [1, 1])
    : useTransform(smoothProgress, [0, 1], [1.08, 1.16]);
  const backgroundOpacity = useTransform(smoothProgress, [0, 0.18, 0.7, 1], [0.54, 0.66, 0.72, 0.68]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.2, 0.7, 1], [0.22, 0.52, 0.42, 0.3]);
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.45, 1], [0.58, 0.48, 0.38]);
  const sheenOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.22, 0.3, 0.24]);

  const logoMaskStyle: CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(18px) saturate(160%)",
    WebkitBackdropFilter: "blur(18px) saturate(160%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.14)",
    WebkitMaskImage: isKa
      ? "url('/logo/svg/black-georgian.svg')"
      : "url('/logo/svg/black-english.svg')",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskImage: isKa
      ? "url('/logo/svg/black-georgian.svg')"
      : "url('/logo/svg/black-english.svg')",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
  };

  return (
    <section ref={sectionRef} className="bg-white px-6 py-20 text-gray-900 lg:px-12 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
        style={{ scale: cardScale }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute -inset-[4%] bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/background/1.jpg')",
              y: backgroundY,
              scale: backgroundScale,
              opacity: backgroundOpacity,
            }}
          />
          <motion.div
            className="absolute -inset-x-[6%] inset-y-0 bg-[radial-gradient(circle_at_50%_62%,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_50%_50%,rgba(214,179,92,0.18),transparent_42%)]"
            style={{ opacity: glowOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,18,0.32)_0%,rgba(8,12,18,0.18)_30%,rgba(8,12,18,0.42)_100%)]"
            style={{ opacity: vignetteOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_24%,rgba(255,255,255,0)_45%,rgba(255,255,255,0.1)_100%)]"
            style={{ opacity: sheenOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_36%)]"
            style={{ opacity: sheenOpacity }}
          />
        </div>

        <div className="relative flex min-h-[440px] items-center justify-center px-6 py-16 sm:min-h-[560px] sm:px-10 sm:py-20 lg:min-h-[680px] lg:px-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            className="flex min-h-0 w-full items-end justify-center self-center"
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.72 }}
              whileInView={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex w-full justify-center self-end will-change-transform"
              style={{ scale: logoScale, x: logoX, y: logoY, opacity: logoOpacity, transformOrigin: "center bottom" }}
            >
              <motion.div
                className="absolute inset-x-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6b35c]/18 blur-3xl sm:h-36 sm:w-36 lg:h-48 lg:w-48"
                style={{ opacity: glowOpacity }}
              />
              <motion.div
                initial={shouldReduceMotion ? undefined : { backgroundPosition: "48% 50%" }}
                whileInView={shouldReduceMotion ? undefined : { backgroundPosition: "52% 50%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.22, ease: "easeOut" }}
                className="relative aspect-[16/7] w-[70vw] max-w-[820px] origin-bottom sm:w-[62vw] lg:w-[48vw]"
                style={logoMaskStyle}
              >
                <div className="absolute inset-0 bg-white/34" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.58),rgba(255,255,255,0.18)_38%,rgba(255,255,255,0.08)_58%,transparent_74%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_34%,rgba(255,255,255,0.08)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.16)_18%,rgba(255,255,255,0.04)_44%,rgba(255,255,255,0.26)_100%)] opacity-90" />
                <div className="absolute inset-[1px] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_34%,rgba(255,255,255,0.1)_100%)]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
