"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface RecoveryPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrase: string;
}

export default function RecoveryPhraseModal({ 
  isOpen, 
  onClose, 
  phrase 
}: RecoveryPhraseModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phrase);
    setCopied(true);
    toast.success("Recovery phrase copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Recovery Phrase
              </h3>
              <p className="text-sm text-muted-foreground">
                Simpan kunci recovery untuk reset kata sandi, kunci tidak akan muncul kembali
              </p>
            </div>

            <div className="mb-6">
              <div className="rounded-lg border border-input bg-card p-4 font-mono text-sm break-words">
                {phrase}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button 
                className="flex-1 flex items-center gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}