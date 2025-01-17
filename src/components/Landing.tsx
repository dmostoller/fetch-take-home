import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import dogAnimation from "@/animations/dog.json";

const LottieAnimation = dynamic(
  () =>
    import("@/components/LottieAnimation").then((mod) => mod.LottieAnimation),
  {
    ssr: false,
    loading: () => <div className="w-[300px] lg:w-[400px] h-[300px]" />,
  },
);

const ANIMATION_CONFIG = {
  duration: 0.6,
  baseDelay: 0.2,
  stagger: 0.15,
  ease: [0.6, -0.05, 0.01, 0.99],
};

const containerVariants = {
  initial: {
    opacity: 1,
    height: "auto",
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger,
    },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease,
      delay: ANIMATION_CONFIG.baseDelay,
      staggerChildren: ANIMATION_CONFIG.stagger,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_CONFIG.duration * 0.5,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

const bgVariants = {
  initial: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger,
    },
  },
};

const textVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease,
      delay: ANIMATION_CONFIG.baseDelay + custom * ANIMATION_CONFIG.stagger,
    },
  }),
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

export default function EnhancedLandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    router.push(isAuthenticated ? "/browse" : "/login");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
      className="min-h-screen w-full bg-background text-foreground overflow-hidden"
    >
      <motion.div
        variants={bgVariants}
        className="relative min-h-screen w-full"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-orange-50 to-yellow-50 dark:from-purple-950/30 dark:via-orange-950/30 dark:to-yellow-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.1),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.1),transparent_40%)]" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>

        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl mx-auto">
            <motion.div
              className="flex-1 text-center lg:text-left max-w-2xl pl-0 lg:pl-6 xl:pl-24"
              variants={contentVariants}
            >
              <motion.h1
                variants={textVariants}
                custom={0}
                className="text-4xl lg:text-6xl font-extrabold mb-6"
              >
                Find Your Perfect
                <motion.span
                  variants={textVariants}
                  custom={1}
                  className="block text-primary"
                >
                  Furry Friend
                </motion.span>
              </motion.h1>

              <motion.div className="space-y-6 text-lg">
                <div className="space-y-4">
                  <motion.h2
                    variants={textVariants}
                    custom={2}
                    className="text-2xl font-semibold"
                  >
                    How it works:
                  </motion.h2>

                  <motion.ol
                    className="space-y-2 max-w-sm text-left"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          delayChildren: ANIMATION_CONFIG.baseDelay + 0.8,
                          staggerChildren: 0.3,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      "Browse available dogs",
                      "Save your favorites",
                      "Get matched with your perfect companion!",
                    ].map((text, i) => (
                      <motion.li
                        key={i}
                        variants={listItemVariants}
                        className="flex items-center justify-start gap-2"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {i + 1}
                        </span>
                        <span className="flex-1">{text}</span>
                      </motion.li>
                    ))}
                  </motion.ol>
                </div>

                <motion.div
                  variants={textVariants}
                  custom={12}
                  className="mt-8"
                >
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="transform transition-transform hover:scale-105"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={contentVariants}
              className="hidden sm:flex flex-shrink-0 lg:flex-1 justify-center lg:justify-end"
            >
              <LottieAnimation
                animationData={dogAnimation}
                className="w-[300px] sm:w-[400px] lg:w-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
