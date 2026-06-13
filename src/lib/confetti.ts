import confetti from "canvas-confetti";

export function fireConfetti() {
  const colors = ["#C6F432", "#4DEEEA", "#B6A6E8", "#FFFFFF", "#1A1A1A"];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    shapes: ["circle", "square"],
    scalar: 1.1,
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 200);
}

export function fireBigConfetti() {
  const colors = ["#C6F432", "#4DEEEA", "#B6A6E8", "#FFFFFF", "#1A1A1A", "#FFE3EC"];
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors,
    startVelocity: 45,
  });
}
