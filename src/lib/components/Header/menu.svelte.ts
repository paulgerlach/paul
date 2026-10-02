/**
 * Mobile menu state. React toggled `active` classes on the burger and its
 * parent and `_lock` on <html> through the DOM; here the classes are derived
 * from this state instead. Client-only UI state, never written during SSR.
 */
class MobileMenu {
	open = $state(false);

	toggle() {
		this.open = !this.open;
	}

	close() {
		this.open = false;
	}
}

export const menu = new MobileMenu();
