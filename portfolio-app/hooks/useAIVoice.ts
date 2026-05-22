'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAudioStore } from '@/store/useAudioStore';

export function useAIVoice() {
  const { isMuted, isPlaying, setPlaying } = useAudioStore();

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    }
  }, [setPlaying]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      
      const synth = window.speechSynthesis;
      synth.cancel(); // Stop anything currently playing

      if (isMuted) {
        setPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a good futuristic/AI-like voice (usually English, sometimes specific ones)
      const voices = synth.getVoices();
      const preferredVoices = [
        'Google UK English Male',
        'Microsoft David',
        'Microsoft Mark',
        'Daniel',
        'Fred',
        'Alex'
      ];
      
      let aiVoice = null;
      for (const v of preferredVoices) {
        const found = voices.find(voice => voice.name.includes(v));
        if (found) {
          aiVoice = found;
          break;
        }
      }
      
      if (!aiVoice) {
        aiVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }

      if (aiVoice) {
        utterance.voice = aiVoice;
      }

      // Slightly lower pitch and steady rate for "AI" feel
      utterance.pitch = 0.9;
      utterance.rate = 0.95;

      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);

      synth.speak(utterance);
    },
    [isMuted, setPlaying]
  );

  // Force loading voices in advance
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Stop speaking immediately if user clicks Mute while AI is talking
  useEffect(() => {
    if (isMuted) {
      stop();
    }
  }, [isMuted, stop]);

  return { speak, stop, isPlaying };
}
