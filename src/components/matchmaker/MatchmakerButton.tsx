import { Button } from "@/components/ui/button";
import { Dog } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MatchmakerDialog } from "./MatchmakerDialog";

interface MatchmakerButtonProps {
  disableGradients?: boolean;
}

export function MatchmakerButton({
  disableGradients = false,
}: MatchmakerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          shadow: [
            "0px 0px 0px rgba(0,0,0,0)",
            "0px 0px 20px rgba(255,165,0,0.3)",
            "0px 0px 0px rgba(0,0,0,0)",
          ],
        }}
        transition={{
          shadow: {
            repeat: Infinity,
            duration: 2,
          },
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          className="
            relative
            z-10
            px-8 
            py-6
            gap-3
            text-lg
            font-semibold
            rounded-full 
            shadow-lg
            bg-gradient-to-t 
            from-[hsl(35,93%,45%)]
            to-[hsl(35,93%,64%)]
            hover:from-[hsl(35,93%,40%)]
            hover:to-[hsl(35,93%,59%)]
            text-white
            transition-all
            duration-300
          "
          variant="default"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Dog className="w-6 h-6" />
          </motion.div>
          Find Your Match
        </Button>
        {!disableGradients && (
          <>
            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-[hsl(35,93%,64%)] via-[hsl(35,93%,45%)] to-[hsl(35,93%,64%)] opacity-75 blur-sm -z-10 animate-[pulse-glow_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-[6px] rounded-full bg-gradient-to-r from-[hsl(35,93%,45%)] via-[hsl(35,93%,64%)] to-[hsl(35,93%,45%)] opacity-50 blur-md -z-20 animate-[pulse-glow_3s_ease-in-out_infinite_reverse]" />
          </>
        )}
      </motion.div>
      <MatchmakerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
