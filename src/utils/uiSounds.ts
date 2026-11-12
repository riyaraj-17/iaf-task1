
export type SoundType = "click" | "success" | "toggle";

const STORAGE_KEY = "hacked_ui_sounds";

let audioContext: AudioContext | null = null;

export const getUiSoundEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const setUiSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch (error) {
    console.warn("Could not save sound preference:", error);
  }
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;

  try {
    if (!audioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return null;

      audioContext = new AudioContextClass();
    }

    return audioContext;
  } catch (error) {
    console.warn("Audio is unavailable:", error);
    return null;
  }
};

export const playUiSound = async (
  type: SoundType = "click",
  force = false
): Promise<void> => {
  if (!force && !getUiSoundEnabled()) return;

  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    const sounds = {
      click: {
        frequency: 680,
        endFrequency: 440,
        duration: 0.045,
        volume: 0.025,
        waveform: "sine" as OscillatorType,
      },
      success: {
        frequency: 520,
        endFrequency: 880,
        duration: 0.22,
        volume: 0.045,
        waveform: "sine" as OscillatorType,
      },
      toggle: {
        frequency: 760,
        endFrequency: 620,
        duration: 0.09,
        volume: 0.03,
        waveform: "triangle" as OscillatorType,
      },
    };

    const sound = sounds[type];
    const now = context.currentTime;

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = sound.waveform;
    oscillator.frequency.setValueAtTime(sound.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      sound.endFrequency,
      now + sound.duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      sound.volume,
      now + 0.008
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + sound.duration
    );

    oscillator.start(now);
    oscillator.stop(now + sound.duration + 0.01);

    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  } catch (error) {
    console.warn("Could not play UI sound:", error);
  }
};
