/**
 * useSpeechToText — voice dictation for any text field.
 *
 * Recovered from the v1 frontend (deleted in the v1→v2 migration; this is a
 * faithful port, not a reinvention). The non-obvious pieces are preserved
 * verbatim because they were hard-won:
 *  - continuous + interimResults:false → only final transcripts fire onResult
 *  - intentionalStop ref → distinguishes a user-stop from the engine ending
 *  - onend auto-restart → mobile Chrome kills continuous recognition after
 *    each pause; without the restart, dictation dies mid-sentence on phones
 *  - cleanup on unmount → stop recognition, never leak a live mic
 *
 * Accessibility note: this exists because typing is high-friction for some
 * users (accent-affected transcription, motor load). Voice is a first-class
 * input path here, not a gimmick.
 *
 * @param {(transcript: string) => void} onResult — called with each final chunk
 * @returns {{ listening: boolean, toggle: () => void, supported: boolean }}
 */
import { useState, useRef, useEffect } from "react";

export function useSpeechToText(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const intentionalStop = useRef(false);
  // Keep the latest callback without re-subscribing the engine.
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const toggle = () => {
    if (listening) {
      intentionalStop.current = true;
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return;

    intentionalStop.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      if (transcript) onResultRef.current?.(transcript);
    };
    recognition.onerror = () => { intentionalStop.current = true; setListening(false); };
    recognition.onend = () => {
      // Mobile Chrome kills continuous recognition after each pause. Auto-
      // restart unless the user intentionally stopped, so dictation survives
      // natural pauses in speech.
      if (!intentionalStop.current) {
        try { recognition.start(); } catch { setListening(false); }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  useEffect(() => {
    return () => {
      intentionalStop.current = true;
      recognitionRef.current?.stop();
    };
  }, []);

  const supported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return { listening, toggle, supported };
}
