/**
 * A short two-tone chime for new orders. Best-effort: wrapped in try/catch and
 * silent if the browser blocks audio (the visual highlight is the primary cue).
 * The owner has interacted with the page (login), so autoplay is generally allowed.
 */
let ctx: AudioContext | null = null;

export function playChime(): void {
  try {
    const AudioCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    ctx ??= new AudioCtor();

    const beep = (freq: number, start: number) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.connect(gain);
      gain.connect(ctx!.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx!.currentTime + start;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.32);
    };

    beep(880, 0);
    beep(1174, 0.16);
  } catch {
    /* audio unavailable — ignore */
  }
}
