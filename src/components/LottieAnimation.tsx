"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  animationData: object;
  className?: string;
}

export const LottieAnimation = ({
  animationData,
  className,
}: LottieAnimationProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder or loading state
    return <div className={className} />;
  }

  return (
    <Lottie animationData={animationData} loop={true} className={className} />
  );
};
