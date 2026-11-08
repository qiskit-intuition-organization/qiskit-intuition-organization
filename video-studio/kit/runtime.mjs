// Timeline helpers available to every scene script (pasted into the board's IIFE).
// All times are seconds on the narrated film. See KIT.md for the list.
export const RUNTIME = `
    const tl = gsap.timeline({ paused: true });
    const $ = (id) => document.getElementById(id);
    const all = (sel) => (Array.isArray(sel) ? sel.flatMap(all) : Array.from(document.querySelectorAll(sel)));
    // Pen draws each stroke of the matched groups in turn, time shared by stroke length.
    function draw(sel, start, dur) {
      const groups = all(sel);
      if (!groups.length) throw new Error("draw: nothing matches " + sel);
      const paths = groups.flatMap((g) => (g.matches("path.ink") ? [g] : Array.from(g.querySelectorAll("path.ink"))));
      const lens = paths.map((p) => Math.max(8, p.getTotalLength()));
      const sum = lens.reduce((a, b) => a + b, 0) || 1;
      groups.forEach((g) => tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, start));
      let t = start;
      paths.forEach((p, k) => {
        const d = (dur * lens[k]) / sum;
        p.style.strokeDasharray = "1 2";
        tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, t);
        t += d;
      });
      groups.flatMap((g) => Array.from(g.querySelectorAll("path.solid"))).forEach((p) => tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.25 }, start + Math.max(0, dur - 0.2)));
    }
    // Labels are written in left to right.
    function write(sel, start, dur = 0.5) {
      const els = all(sel);
      if (!els.length) throw new Error("write: nothing matches " + sel);
      els.forEach((el) => tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power1.inOut" }, start));
    }
    // Write a label again after it was faded out: makes it visible at start, then wipes it in.
    function rewrite(sel, start, dur = 0.5) {
      const els = all(sel);
      tl.set(els, { opacity: 1 }, start);
      els.forEach((el) => tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power1.inOut", immediateRender: false }, start));
    }
    const fade = (sel, to, start, dur = 0.35) => tl.to(all(sel), { opacity: to, duration: dur, ease: "power2.inOut" }, start);
    const hide = (sel) => tl.set(all(sel), { opacity: 0 }, 0);
    const show = (sel, start) => tl.set(all(sel), { opacity: 1 }, start);
    const blurOut = (sel, start, dur = 0.25) => tl.to(all(sel), { opacity: 0, filter: "blur(8px)", duration: dur, ease: "power3.in" }, start);
    const move = (sel, from, to, start, dur = 0.8, ease = "power2.inOut") => tl.fromTo(all(sel), from, { ...to, duration: dur, ease }, start);
    // Continuous drawings that follow a value (a dial, a trace, a counter): onFrame(fn) calls
    // fn(t) on every frame and on every seek, with t in seconds.
    const __frames = [];
    const onFrame = (fn) => __frames.push(fn);
    const ease = { inOut: (u) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u))), clamp: (u) => Math.min(1, Math.max(0, u)) };
    // Value schedule: segs = [[start, end, from, to], ...]; returns the value at t, eased in-out.
    function sched(segs, t, initial = segs.length ? segs[0][2] : 0) {
      let v = initial;
      for (const [a, b, f, to] of segs) { if (t <= a) break; v = t >= b ? to : f + (to - f) * ease.inOut((t - a) / (b - a)); }
      return v;
    }
    function __finish() {
      if (!__frames.length) return;
      const clock = { t: 0 };
      const run = (t) => __frames.forEach((fn) => fn(t));
      tl.fromTo(clock, { t: 0 }, { t: TOTAL, duration: TOTAL, ease: "none", onUpdate: () => run(clock.t) }, 0);
      window.addEventListener("hf-seek", (e) => run(e.detail.time));
      run(0);
    }
`;
