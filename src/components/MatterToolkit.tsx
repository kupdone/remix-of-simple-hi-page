import { useEffect, useRef } from "react";
import Matter from "matter-js";

type Pill = { label: string; tone: "light" | "dark" | "accent" };

const PILLS: Pill[] = [
  { label: "Website Design", tone: "dark" },
  { label: "WordPress", tone: "light" },
  { label: "Shopify", tone: "light" },
  { label: "SEO", tone: "accent" },
  { label: "Google Business", tone: "light" },
  { label: "AI Automation", tone: "dark" },
  { label: "React", tone: "light" },
  { label: "Next.js", tone: "light" },
  { label: "Hosting", tone: "light" },
  { label: "Maintenance", tone: "light" },
];

function styleFor(tone: Pill["tone"]) {
  if (tone === "dark") return { bg: "#0A0A0B", fg: "#FFFFFF", border: "#0A0A0B" };
  if (tone === "accent") return { bg: "#E8FF3A", fg: "#0A0A0B", border: "#0A0A0B" };
  return { bg: "#FFFFFF", fg: "#0A0A0B", border: "#E7E7E4" };
}

export function MatterToolkit() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    let width = wrap.clientWidth;
    let height = wrap.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0;
    engine.gravity.x = 0;

    const render = Render.create({
      canvas, engine,
      options: { width, height, background: "transparent", wireframes: false, pixelRatio: window.devicePixelRatio || 1 },
    });

    const wallT = 40;
    const wallOpts = { isStatic: true, render: { visible: false } };
    const walls = [
      Bodies.rectangle(width / 2, height + wallT / 2, width * 2, wallT, wallOpts),
      Bodies.rectangle(-wallT / 2, height / 2, wallT, height * 2, wallOpts),
      Bodies.rectangle(width + wallT / 2, height / 2, wallT, height * 2, wallOpts),
      Bodies.rectangle(width / 2, -wallT / 2, width * 2, wallT, wallOpts),
    ];
    Composite.add(engine.world, walls);

    const measurer = document.createElement("span");
    measurer.style.cssText =
      "position:absolute;visibility:hidden;font-weight:500;font-size:13px;letter-spacing:-0.01em;font-family:Inter,system-ui,sans-serif;padding:0 16px;white-space:nowrap;";
    document.body.appendChild(measurer);

    const bodies: (Matter.Body & { _pill?: Pill; _w?: number; _h?: number })[] = [];
    const cols = 3;
    const rows = Math.ceil(PILLS.length / cols);
    PILLS.forEach((p, i) => {
      measurer.textContent = p.label;
      const w = Math.ceil(measurer.getBoundingClientRect().width) + 16;
      const h = 34;
      const s = styleFor(p.tone);
      const col = i % cols, row = Math.floor(i / cols);
      const cellW = width / cols, cellH = height / rows;
      const x = cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.4;
      const y = cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.4;
      const body = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.35,
        friction: 0.02,
        frictionAir: 0.14,
        density: 0.002,
        render: { fillStyle: s.bg, strokeStyle: s.border, lineWidth: 1 },
      }) as Matter.Body & { _pill?: Pill };
      Body.setAngle(body, (Math.random() - 0.5) * 0.2);
      body._pill = p;
      bodies.push(body);
    });
    document.body.removeChild(measurer);
    Composite.add(engine.world, bodies);

    const mouse = Mouse.create(canvas);
    // @ts-expect-error internal
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    const mConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.16, damping: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, mConstraint);
    render.mouse = mouse;

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "500 13px Inter,system-ui,sans-serif";
      for (const b of bodies) {
        const p = b._pill; if (!p) continue;
        const s = styleFor(p.tone);
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);
        ctx.fillStyle = s.fg;
        ctx.fillText(p.label, 0, 1);
        ctx.restore();
      }
      ctx.restore();
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (w === width && h === height) return;
      const oldW = width, oldH = height;
      width = w; height = h;
      render.canvas.width = w * (window.devicePixelRatio || 1);
      render.canvas.height = h * (window.devicePixelRatio || 1);
      render.options.width = w; render.options.height = h;
      Render.setPixelRatio(render, window.devicePixelRatio || 1);
      Body.setPosition(walls[0], { x: w / 2, y: h + wallT / 2 });
      Body.setPosition(walls[1], { x: -wallT / 2, y: h / 2 });
      Body.setPosition(walls[2], { x: w + wallT / 2, y: h / 2 });
      Body.setPosition(walls[3], { x: w / 2, y: -wallT / 2 });
      const sx = w / oldW, sy = h / oldH;
      for (const b of bodies) Body.setPosition(b, { x: b.position.x * sx, y: b.position.y * sy });
    });
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      render.canvas.width = 0; render.canvas.height = 0;
    };
  }, []);

  return (
    <div
      className="rounded-2xl bg-white p-5 md:p-6"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] font-medium text-[var(--muted)]">The toolkit</div>
          <div className="font-display mt-1 text-[20px] font-semibold text-[var(--ink)] md:text-[22px]">
            Drag the tools I ship with.
          </div>
        </div>
        <div className="hidden text-right text-[12px] text-[var(--muted)] sm:block">Grab a pill.</div>
      </div>
      <div
        ref={wrapRef}
        className="relative h-[300px] w-full touch-none select-none overflow-hidden md:h-[360px]"
        style={{
          borderRadius: 16,
          background:
            "radial-gradient(circle at 1px 1px, rgba(10,10,11,0.08) 1px, transparent 0) 0 0 / 18px 18px, #FAFAF7",
          border: "1px solid var(--border)",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
