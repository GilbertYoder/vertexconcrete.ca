import { onScroll } from "./scroll";

/**
 * Nav bar: gets a blurred background once the page is scrolled, and shows the
 * centre logo (a "back to top" link) once the hero has scrolled up behind it.
 */
export function initNav() {
	const nav = document.querySelector<HTMLElement>("nav");
	const hero = document.querySelector<HTMLElement>("#home");
	const navLogo = document.querySelector<HTMLAnchorElement>(".nav-logo");
	if (!nav) return;

	const update = () => {
		nav.classList.toggle("scrolled", window.scrollY > 10);
		const pastHero = !!hero && hero.getBoundingClientRect().bottom <= nav.offsetHeight;
		nav.classList.toggle("show-logo", pastHero);
		if (navLogo) navLogo.inert = !pastHero; // not clickable/focusable while hidden
	};
	onScroll(update);
	window.addEventListener("resize", update, { passive: true });

	navLogo?.addEventListener("click", (e) => {
		e.preventDefault(); // keep #home out of the URL
		window.scrollTo({ top: 0 }); // smooth via html { scroll-behavior: smooth }
		navLogo.blur();
	});
}
