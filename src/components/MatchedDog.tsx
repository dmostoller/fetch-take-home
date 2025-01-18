import { Dog } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import { RefreshCw, MapPin, PartyPopper, Bone } from "lucide-react";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

interface MatchedDogProps {
  dog: Dog;
  onReset: () => void;
}

export function MatchedDog({ dog, onReset }: MatchedDogProps) {
  const { width, height } = useWindowSize();

  return (
    <>
      <ReactConfetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      <motion.div
        initial={{ rotateY: -180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ perspective: 1000 }}
      >
        <Card className="w-full max-w-2xl mx-auto overflow-hidden mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="relative h-[500px] w-full"
          >
            <Image
              src={dog.img}
              alt={dog.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-4 right-4"
            >
              <Button
                variant="outline"
                onClick={onReset}
                className="backdrop-blur-sm transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </motion.div>
          </motion.div>

          <CardContent className="relative -mt-32 bg-gradient-to-b from-transparent to-background p-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <div className="text-center space-y-2">
                <motion.div
                  className="inline-flex items-center gap-2 text-amber-500 font-medium mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 1.4,
                    times: [0, 0.3, 0.6, 1],
                  }}
                >
                  <PartyPopper className="w-5 h-5" />
                  <span>Perfect Match Found!</span>
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  Meet {dog.name}
                </motion.h1>

                <motion.p
                  className="text-lg text-muted-foreground max-w-md mx-auto pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  Your perfect companion is waiting to bring joy and love into
                  your life
                </motion.p>
              </div>

              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-base flex items-center gap-2"
                >
                  <Bone className="w-4 h-4" />
                  {dog.breed}
                </Badge>

                <Badge variant="outline" className="px-4 py-2 text-base">
                  {dog.age} {dog.age === 1 ? "year" : "years"} old
                </Badge>

                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {dog.zip_code}
                </Badge>
              </motion.div>

              <motion.div
                className="w-full max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button className="w-full h-12 text-lg mt-6" size="lg">
                    Start Adoption Process
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
