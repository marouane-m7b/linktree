/** Standard browser layout: Xbox/XInput and 8BitDo in XInput mode. */
export function readController() {
  let pads: (Gamepad | null)[] = [];
  try { pads = Array.from(navigator.getGamepads?.() ?? []); } catch { /* unavailable browser context */ }
  const pad = pads.find(p => p?.connected && p.mapping === "standard");
  const unsupported = pads.some(p => p?.connected && p.mapping !== "standard");
  const down = (i: number) => Boolean(pad?.buttons[i]?.pressed);
  const axis = (i: number) => { const v = pad?.axes[i] ?? 0; return Math.abs(v) <= .18 ? 0 : Math.sign(v) * (Math.abs(v) - .18) / .82; };
  let x = axis(0) + Number(down(15)) - Number(down(14));
  let z = axis(1) + Number(down(13)) - Number(down(12));
  const length = Math.hypot(x, z); if (length > 1) { x /= length; z /= length; }
  return { id: pad?.id ?? "", index: pad?.index ?? -1, unsupported, x, z, cameraX: axis(2), cameraY: axis(3), sprint: down(10) || down(7), confirm: down(0), back: down(1), previous: down(4), next: down(5), menu: down(9), up: down(12), down: down(13), zoomIn: down(6), zoomOut: down(7) };
}
