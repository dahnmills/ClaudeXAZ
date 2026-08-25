/**
 * A plug + cable rendered as a flat, single-color silhouette (matching the
 * classic "unplugged" icon style), sharing one canvas/coordinate space with
 * its counterpart so the two connectors can genuinely touch when "plugged
 * in". The cable is a decorative wave (not a physics sag) — the previous
 * gravity-simulated rope read as droopy, not the clean, controlled curve
 * this style calls for. The plug's position still eases via a damped
 * spring, which is what gives the unplug motion its organic settle.
 */

export interface CableRigColors {
  plug: string;
  cable: string;
  /** The page background — used to "punch" the socket's receptacle holes. */
  socketPunch: string;
}

const BODY_SIZE = 60;
const PRONG_LENGTH = 20;
// Both bodies are measured from the centerline by the SAME formula
// (BODY_SIZE + half the body-to-body gap) regardless of male/female — that
// symmetry is what guarantees the two solid body rectangles never overlap.
// Only the thin prong is allowed to cross the centerline: with a 6px gap
// between the bodies and a 20px prong, the prong reaches 14px past the
// female's face — visibly inserted, without the bodies ever touching.
const BODY_GAP_CONNECTED = 6;
const BODY_GAP_RESTING = 130;
const ANCHOR_INSET = 40; // px the cable's far end sits in from the canvas edge
const WAVE_AMPLITUDE = 22;
const SPRING_STIFFNESS = 70;
const SPRING_DAMPING = 11;
export const BURST_DURATION = 0.5;

/** Time (s) from `startDisconnect()` to the plug's first overshoot peak. */
export const PEAK_OVERSHOOT_TIME =
  Math.PI / (Math.sqrt(SPRING_STIFFNESS) * Math.sqrt(1 - (SPRING_DAMPING / (2 * Math.sqrt(SPRING_STIFFNESS))) ** 2));

export class CableRig {
  private readonly plugDepth: number;
  private connectedOffset = 0;
  private restingOffset = 0;
  private plugOffset = 0; // distance from the shared centerline, always positive
  private velocity = 0;
  private targetOffset = 0;
  private centerX = 0;
  private centerY = 0;
  private canvasWidth = 0;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly isMale: boolean,
    private readonly side: 'left' | 'right',
    private readonly colors: CableRigColors,
  ) {
    this.plugDepth = isMale ? BODY_SIZE + PRONG_LENGTH : BODY_SIZE;
  }

  resize(width: number, height: number): void {
    this.canvasWidth = width;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.connectedOffset = BODY_SIZE + BODY_GAP_CONNECTED / 2;
    this.restingOffset = BODY_SIZE + BODY_GAP_RESTING / 2;

    if (this.plugOffset === 0) {
      this.plugOffset = this.connectedOffset;
      this.targetOffset = this.connectedOffset;
    }
  }

  /** Switch the spring target from "connected" to "resting" — the unplug. */
  startDisconnect(): void {
    this.targetOffset = this.restingOffset;
  }

  step(dt: number): void {
    const accel = -SPRING_STIFFNESS * (this.plugOffset - this.targetOffset) - SPRING_DAMPING * this.velocity;
    this.velocity += accel * dt;
    this.plugOffset += this.velocity * dt;
  }

  private plugX(): number {
    return this.side === 'left' ? this.centerX - this.plugOffset : this.centerX + this.plugOffset;
  }

  private anchorX(): number {
    return this.side === 'left' ? ANCHOR_INSET : this.canvasWidth - ANCHOR_INSET;
  }

  /** The connector's outward-facing tip — where this rig's burst fires from. */
  private tipX(): number {
    const px = this.plugX();
    return this.side === 'left' ? px + this.plugDepth : px - this.plugDepth;
  }

  /** Rings + a small scatter of particles at this connector's tip.
   * `progress` runs 0 (fires) → 1 (fully faded); outside that range draws
   * nothing. */
  drawBurst(progress: number): void {
    if (progress < 0 || progress > 1) return;
    const ctx = this.ctx;
    const tx = this.tipX();
    const ty = this.centerY;

    ctx.save();
    for (let ring = 0; ring < 2; ring++) {
      const rp = progress - ring * 0.18;
      if (rp <= 0 || rp > 1) continue;
      ctx.globalAlpha = (1 - rp) * 0.6;
      ctx.strokeStyle = this.colors.cable;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tx, ty, 3 + rp * 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    const particleCount = 7;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (this.side === 'left' ? 0 : 0.4);
      const dist = progress * 26;
      ctx.globalAlpha = Math.max(0, 1 - progress * 1.15);
      ctx.fillStyle = i % 2 === 0 ? this.colors.plug : this.colors.cable;
      ctx.beginPath();
      ctx.arc(tx + Math.cos(angle) * dist, ty + Math.sin(angle) * dist, 2.5 * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  draw(): void {
    this.drawCable();
    this.drawPlug();
  }

  private drawCable(): void {
    const ctx = this.ctx;
    const ax = this.anchorX();
    const px = this.plugX();
    const cy = this.centerY;
    // One gentle S-curve for the whole run — not a repeating wave. A single
    // sine half-period (0 → π) bends one way then back, which is the "one
    // elegant curve" look; multiple periods read as a mechanical zigzag.
    const points: { x: number; y: number }[] = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = ax + (px - ax) * t;
      const y = cy + Math.sin(t * Math.PI) * WAVE_AMPLITUDE * (this.side === 'left' ? 1 : -1);
      points.push({ x, y });
    }

    ctx.save();
    ctx.strokeStyle = this.colors.cable;
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();

    // Explicit rounded terminator at the anchor end — a stroke cap sitting
    // this close to the canvas edge otherwise gets half-clipped and reads
    // as a flat cut rather than a rounded tip.
    ctx.fillStyle = this.colors.cable;
    ctx.beginPath();
    ctx.arc(ax, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawPlug(): void {
    const ctx = this.ctx;
    const px = this.plugX();
    const py = this.centerY;
    const facingCenter = this.side === 'left' ? 1 : -1; // which way the connector's face points
    const bodyLeft = this.side === 'left' ? px : px - BODY_SIZE;

    ctx.save();
    ctx.fillStyle = this.colors.plug;
    this.roundedRectFill(bodyLeft, py - BODY_SIZE / 2, BODY_SIZE, BODY_SIZE, 14);

    if (this.isMale) {
      const prongX = facingCenter === 1 ? bodyLeft + BODY_SIZE : bodyLeft - PRONG_LENGTH;
      this.roundedRectFill(prongX, py - 18, PRONG_LENGTH, 10, 5);
      this.roundedRectFill(prongX, py + 8, PRONG_LENGTH, 10, 5);
    } else {
      ctx.fillStyle = this.colors.socketPunch;
      const holeX = facingCenter === 1 ? bodyLeft + BODY_SIZE - 18 : bodyLeft + 18;
      ctx.beginPath(); ctx.arc(holeX, py - 13, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(holeX, py + 13, 6, 0, Math.PI * 2); ctx.fill();
    }

    // A small grip texture near where the cable meets the body — the detail
    // that reads as "crafted" rather than a plain box, per the reference.
    ctx.fillStyle = this.colors.socketPunch;
    const backEdge = facingCenter === 1 ? bodyLeft : bodyLeft + BODY_SIZE;
    const ridgeDir = facingCenter === 1 ? 1 : -1;
    for (let i = 0; i < 3; i++) {
      const rx = backEdge + ridgeDir * (7 + i * 6);
      ctx.fillRect(rx, py - 15, 2, 30);
    }

    ctx.restore();
  }

  /** Runs the spring forward synchronously (for the reduced-motion static frame). */
  fastForward(seconds: number): void {
    this.startDisconnect();
    const dt = 1 / 60;
    for (let t = 0; t < seconds; t += dt) this.step(dt);
  }

  private roundedRectFill(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  }
}

