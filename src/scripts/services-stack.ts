/** How much of each card shows under the next one. */
const PEEK_REM = 0.75;

/**
 * Services stacking cards (phones only). The heading + cards sit in a "stage"
 * that sticks under the nav while the outer .stack scrolls past. Each card is
 * moved up in step with the scroll until it lands on the stack; once the last
 * one lands the stage unsticks and everything leaves together.
 *
 * Depends on the CSS making .stack-stage `position: sticky` on phones.
 */
export function initServicesStack() {
	const mq = window.matchMedia("(max-width: 599px)");
	const stack = document.querySelector<HTMLElement>("#services .stack");
	const stage = stack?.querySelector<HTMLElement>(".stack-stage");
	const cardsEl = stack?.querySelector<HTMLElement>(".cards");
	const cards = [...(cardsEl?.querySelectorAll<HTMLElement>(".card") ?? [])];
	if (!stack || !stage || !cardsEl || !cards.length) return;

	let natural: number[] = []; // each card's top in the plain list layout
	let peek = 0;
	let pEnd = 0; // scroll distance it takes to stack every card
	let active = false;

	const position = () => {
		if (!active) return;
		const stickTop = parseFloat(getComputedStyle(stage).top) || 0;
		const p = Math.min(Math.max(stickTop - stack.getBoundingClientRect().top, 0), pEnd);
		cards.forEach((card, k) => {
			const shift = Math.min(p, natural[k] - k * peek);
			card.style.transform = shift > 0 ? `translateY(${-shift}px)` : "";
		});
	};

	const measure = () => {
		// reset to the plain list layout before measuring
		cards.forEach((c) => (c.style.transform = ""));
		cardsEl.style.height = "";
		stack.style.height = "";
		active = mq.matches;
		if (!active) return;

		peek = PEEK_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
		natural = cards.map((c) => c.offsetTop - cards[0].offsetTop);
		const stackedH = Math.max(...cards.map((c, k) => k * peek + c.offsetHeight));
		pEnd = natural[natural.length - 1] - (cards.length - 1) * peek;
		// the stage only needs to be as tall as the finished stack...
		cardsEl.style.height = `${stackedH}px`;
		// ...and the outer track adds the scroll distance it takes to stack them
		stack.style.height = `${stage.offsetHeight + pEnd}px`;
		position();
	};

	measure();
	document.fonts?.ready.then(measure);
	window.addEventListener("scroll", position, { passive: true });
	window.addEventListener("resize", measure);
	mq.addEventListener("change", measure);
}
