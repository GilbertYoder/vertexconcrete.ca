import { reduceMotion } from "./motion";
import { onScroll } from "./scroll";

/** How fast the hero photo moves relative to the page (0 = fixed, 1 = normal). */
const SPEED = 0.3;

/**
 * Hero parallax: the background photo drifts down at a fraction of the scroll
 * speed, so it moves slower than the page. Skipped for reduced motion.
 */
export function initParallax() {
	const hero = document.querySelector<HTMLElement>("#home");
	const bg = hero?.querySelector<HTMLElement>(".hero-bg");
	if (!hero || !bg) return;

	onScroll(() => {
		if (reduceMotion.matches) {
			bg.style.transform = "";
			return;
		}
		const y = Math.min(window.scrollY, hero.offsetHeight);
		bg.style.transform = `translate3d(0, ${y * SPEED}px, 0)`;
	});
}
