/**
 * Nav bar: gets a blurred background once the page is scrolled, and shows the
 * centre logo (a "back to top" link) once the hero has scrolled up behind it.
 *
 * Uses IntersectionObservers rather than a scroll listener, so nothing runs
 * while scrolling except at the two moments that matter.
 */
export function initNav() {
	const nav = document.querySelector<HTMLElement>("nav");
	const hero = document.querySelector<HTMLElement>("#home");
	const navLogo = document.querySelector<HTMLAnchorElement>(".nav-logo");
	if (!nav) return;

	// "scrolled" once a 1px marker 10px down the page leaves the screen
	const marker = document.createElement("div");
	marker.setAttribute("aria-hidden", "true");
	marker.style.cssText = "position:absolute;top:10px;left:0;width:1px;height:1px;pointer-events:none";
	document.body.prepend(marker);
	new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting)).observe(marker);

	// logo shows once the hero's bottom edge has passed under the nav
	if (hero) {
		new IntersectionObserver(
			([e]) => {
				const pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
				nav.classList.toggle("show-logo", pastHero);
				if (navLogo) navLogo.inert = !pastHero; // not clickable/focusable while hidden
			},
			{ rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` },
		).observe(hero);
	}

	navLogo?.addEventListener("click", (e) => {
		e.preventDefault(); // keep #home out of the URL
		window.scrollTo({ top: 0 }); // smooth via html { scroll-behavior: smooth }
		navLogo.blur();
	});
}
