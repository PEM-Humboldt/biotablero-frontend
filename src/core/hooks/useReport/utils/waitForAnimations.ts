const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)));

type WaitOptions = {
  quietMs?: number;
  timeoutMs?: number;
};

export async function waitForAnimations(
  element: HTMLElement,
  { quietMs = 150, timeoutMs = 3000 }: WaitOptions = {},
): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  let lastChange = performance.now();

  const observer = new MutationObserver(() => {
    lastChange = performance.now();
  });

  observer.observe(element, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
    // attributeFilter: ["style", "class"],
  });

  try {
    // Revisar, esperar, revisar hasta que todo melo

    while (performance.now() < deadline) {
      // Esperar que las animaciones sucedan...
      const running = element
        .getAnimations({ subtree: true })
        .filter(
          (a) =>
            a.playState === "running" &&
            Number.isFinite(a.effect?.getComputedTiming().endTime),
        );

      if (running.length > 0) {
        await Promise.race([
          Promise.allSettled(running.map((a) => a.finished)),
          sleep(deadline - performance.now()),
        ]);
        lastChange = performance.now();
        continue;
      }

      // esperar que carguen las teselas...
      const loading = Array.from(element.querySelectorAll("img")).filter(
        (img) => !img.complete,
      );

      if (loading.length > 0) {
        await Promise.race([
          Promise.allSettled(loading.map((img) => img.decode())),
          sleep(deadline - performance.now()),
        ]);
        lastChange = performance.now();
        continue;
      }

      if (performance.now() - lastChange >= quietMs) {
        return;
      }

      await sleep(30);
    }
  } finally {
    observer.disconnect();
  }
}
