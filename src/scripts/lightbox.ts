/**
 * Gallery lightbox (PhotoSwipe): swipe, pinch-zoom, swipe down to close.
 *
 * Nothing from PhotoSwipe is downloaded with the page. Its code and CSS load
 * the first time someone touches the gallery (so it's usually ready by the
 * time the tap finishes), and the links still point at the large images, so
 * a photo opens even if this never runs.
 * Each link needs data-pswp-width / data-pswp-height.
 */
// Imported as a URL (not as CSS) so it isn't added to the page's stylesheets;
// it's attached only when the viewer is first needed.
import pswpCssUrl from "photoswipe/style.css?url";

type PhotoSwipeCtor = typeof import("photoswipe").default;

const loadCss = () =>
	new Promise<void>((resolve) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = pswpCssUrl;
		link.onload = link.onerror = () => resolve();
		document.head.append(link);
	});

export function initLightbox() {
	const gallery = document.querySelector<HTMLElement>("#gallery .carousel");
	if (!gallery) return;
	const links = [...gallery.querySelectorAll<HTMLAnchorElement>("a.lightbox-link")];

	let loading: Promise<PhotoSwipeCtor> | undefined;
	const load = () =>
		(loading ??= Promise.all([import("photoswipe"), loadCss()]).then(([m]) => m.default));

	// warm up as soon as the gallery is touched or hovered
	gallery.addEventListener("pointerdown", load, { once: true, passive: true });
	gallery.addEventListener("pointerover", load, { once: true, passive: true });

	gallery.addEventListener("click", async (e) => {
		const link = (e.target as Element).closest<HTMLAnchorElement>("a.lightbox-link");
		// let ctrl/cmd/shift-click open the image normally
		if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
		e.preventDefault();

		const PhotoSwipe = await load();
		new PhotoSwipe({
			dataSource: links.map((a) => {
				const thumb = a.querySelector("img");
				return {
					src: a.href,
					width: Number(a.dataset.pswpWidth),
					height: Number(a.dataset.pswpHeight),
					alt: thumb?.alt,
					msrc: thumb?.currentSrc, // shown while the large image loads
					element: a, // zoom-in animation starts from this photo
					thumbCropped: true, // thumbnails are object-fit: cover
				};
			}),
			index: links.indexOf(link),
			bgOpacity: 0.92,
			wheelToZoom: true,
		}).init();
	});
}
