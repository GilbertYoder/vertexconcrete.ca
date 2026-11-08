import { reduceMotion } from "./motion";

/** What fades and slides up as it scrolls into view. */
const TARGETS = [
	"section:not(#home) > .eyebrow",
	"section:not(#home) > h2",
	"#services .stack-stage > .eyebrow",
	"#services .stack-stage > h2",
	"#services .card",
	"#about > p:not(.eyebrow)",
	".about-img",
	"#gallery .carousel-wrap", // whole strip, so off-screen photos aren't left hidden
	"#contact > .card",
	"#contact > form",
];

/**
 * Scroll reveals: major pieces fade and slide up as they come into view, with
 * a slight stagger when several enter together. The .reveal class is added
 * here rather than in the HTML so nothing stays hidden if JS doesn't run.
 */
export function initReveal() {
	if (!("IntersectionObserver" in window) || reduceMotion.matches) return;

	const observer = new IntersectionObserver(
		(entries) => {
			let n = 0;
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const el = entry.target as HTMLElement;
				el.style.transitionDelay = `${Math.min(n++, 5) * 90}ms`;
				el.classList.add("visible");
				// drop the delay afterwards so it doesn't slow later transitions
				el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
				observer.unobserve(el);
			}
		},
		{ rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
	);
	document.querySelectorAll<HTMLElement>(TARGETS.join(", ")).forEach((el) => {
		el.classList.add("reveal");
		observer.observe(el);
	});
}
