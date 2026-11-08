import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

/**
 * Gallery lightbox (PhotoSwipe): swipe, pinch-zoom, swipe down to close.
 * The viewer code itself is only downloaded when a photo is first opened.
 * Each link needs data-pswp-width / data-pswp-height.
 */
export function initLightbox() {
	const lightbox = new PhotoSwipeLightbox({
		gallery: "#gallery .carousel",
		children: "a.lightbox-link",
		pswpModule: () => import("photoswipe"),
		bgOpacity: 0.92,
		wheelToZoom: true,
	});
	lightbox.init();
}
