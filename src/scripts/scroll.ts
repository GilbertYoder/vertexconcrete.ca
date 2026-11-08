/**
 * One shared scroll listener for the whole page. Everything that reacts to
 * scrolling registers here, and all of it runs together once per animation
 * frame instead of each feature handling every scroll event separately.
 */
const callbacks: Array<() => void> = [];
let queued = false;

const run = () => {
	queued = false;
	for (const fn of callbacks) fn();
};

/** Call `fn` now and then once per frame whenever the page scrolls. */
export function onScroll(fn: () => void) {
	if (!callbacks.length) {
		window.addEventListener(
			"scroll",
			() => {
				if (!queued) {
					queued = true;
					requestAnimationFrame(run);
				}
			},
			{ passive: true },
		);
	}
	callbacks.push(fn);
	fn();
}
