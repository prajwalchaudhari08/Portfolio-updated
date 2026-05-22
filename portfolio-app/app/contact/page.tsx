'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import ContactForm from '@/components/forms/ContactForm';
import { useIsMobile } from '@/hooks/useMediaQuery';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

export default function ContactPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      <Scene simplified={isMobile} className="z-0" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_80%)] pointer-events-none z-[1]" />

      <div className="relative z-10 min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="self-start mb-6 ml-0 md:ml-8"
        >
          <NeonButton variant="ghost" onClick={() => router.push('/experience')} icon={ArrowLeft}>
            Abort Connection
          </NeonButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex justify-center"
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
