/**
 * The wizard's icons and sketches, the design's (`SV`, `SK`, `HK`, the device
 * icons and the check mark). Static, trusted markup, rendered with `{@html}`.
 */

/** The check mark (`CK`). */
export const CHECK =
	'<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10.5l3.2 3L15 7"/></svg>';

/** The answer cards' icons (`SV`). */
export const ICONS = {
	doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
	none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/></svg>',
	q: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9.2 9.2a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1-1.3 1.9v.6"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/></svg>',
	radio:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 9a10 10 0 0 1 14 0M7.6 11.8a6.3 6.3 0 0 1 8.8 0"/><circle cx="12" cy="15" r="1.3" fill="currentColor"/><path d="M12 16.5V21"/></svg>',
	meter:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M8 10h8M8 14h5"/></svg>',
	half: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M12 5v14M15 10a3 3 0 0 1 3 0"/></svg>',
	plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
	swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
	keep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
	spark:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
	up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5M7 10l5-5 5 5M5 19h14"/></svg>',
	list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M10 8.5h6M10 12h6M10 15.5h6"/><circle cx="7.4" cy="8.5" r=".6" fill="currentColor"/><circle cx="7.4" cy="12" r=".6" fill="currentColor"/><circle cx="7.4" cy="15.5" r=".6" fill="currentColor"/></svg>',
	receipt:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/></svg>',
	both: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7.5" y="3" width="12.5" height="14.5" rx="2"/><path d="M16.5 20.5H6a2 2 0 0 1-2-2V7"/><path d="M10.5 7.5h6.5M10.5 10.5h6.5M10.5 13.5h4"/></svg>',
	nodoc:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5"/></svg>',
	cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.2 10.5h10.2L20 7.5H6.3"/><circle cx="9.5" cy="18.8" r="1.4"/><circle cx="16.5" cy="18.8" r="1.4"/></svg>',
	rent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/></svg>',
	cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
	energy:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 17h2M9 14h4M9 11h6"/></svg>',
	balance:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="1.8" fill="#fff"/><circle cx="15" cy="12" r="1.8" fill="#fff"/><circle cx="7" cy="17" r="1.8" fill="#fff"/></svg>',
	lead: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/><path d="M9.5 14.5h5"/></svg>',
	legionella:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.5L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9.5V3"/><path d="M7.5 15h9"/></svg>',
} as const;

export type IconName = keyof typeof ICONS;

/** The device icons (16 px), for a device without a photo. */
export const DEVICE_ICONS = {
	kwz: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z"/></svg>',
	wwz: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h8a3 3 0 0 1 3 3v1M6 8V5h4v3"/><path d="M14 14.5s1.3 1.5 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.8 1.3-2.3 1.3-2.3zM16.5 3.5c-.6.7.6 1.3 0 2M18.5 3.5c-.6.7.6 1.3 0 2"/></svg>',
	wmz: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2.5c.5 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.6 2.3-4.6.3 1.6 1 2.4 2 2.8C9.4 7.6 9.3 5 10 2.5z"/></svg>',
	hkv: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="14" height="10" rx="2"/><path d="M7 6v10M10 6v10M13 6v10M5 16v2M15 16v2M10 2.5c-.6.8.6 1.4 0 2.2"/></svg>',
	weitere:
		'<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z"/></svg>',
	rwm: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="2.5"/><path d="M10 3v2M10 15v2"/></svg>',
} as const;

/** The installation sketches (`SK`). */
export const SKETCHES = {
	up: '<svg viewBox="0 0 96 60"><rect width="96" height="60" fill="#F4F6F5"/><g stroke="#DCE2DF" stroke-width="1"><path d="M0 15h96M0 30h96M0 45h96M24 0v15M56 0v15M8 15v15M40 15v15M72 15v15M24 30v15M56 30v15M8 45v15M40 45v15M72 45v15"/></g><circle cx="48" cy="30" r="22" fill="#E6EBE8" stroke="#9AA6A1" stroke-width="1.5"/><circle cx="48" cy="30" r="15" fill="#fff" stroke="#1E322D" stroke-width="1.6"/><circle cx="48" cy="30" r="12" fill="none" stroke="#8AD68F" stroke-width="2"/><rect x="40" y="23" width="16" height="5" rx="1" fill="#1E322D"/><circle cx="48" cy="35" r="3" fill="none" stroke="#1E322D" stroke-width="1.2"/><path d="M48 35l2.4-1.6" stroke="#D9622B" stroke-width="1.2"/></svg>',
	ap: '<svg viewBox="0 0 96 60"><rect width="96" height="60" fill="#F4F6F5"/><rect x="0" y="38" width="96" height="8" fill="#B8C2BD"/><rect x="0" y="38" width="96" height="2.5" fill="#D3DAD6"/><rect x="10" y="46" width="4" height="10" fill="#9AA6A1"/><rect x="82" y="46" width="4" height="10" fill="#9AA6A1"/><path d="M24 35h7l2 4v6l-2 4h-7l-2-4v-6z" fill="#D9B26A" stroke="#8A6A2A" stroke-width="1"/><path d="M65 35h7l2 4v6l-2 4h-7l-2-4v-6z" fill="#D9B26A" stroke="#8A6A2A" stroke-width="1"/><rect x="33" y="34" width="30" height="16" rx="3" fill="#C99A45" stroke="#8A6A2A" stroke-width="1"/><circle cx="48" cy="24" r="15" fill="#fff" stroke="#1E322D" stroke-width="1.6"/><circle cx="48" cy="24" r="12" fill="none" stroke="#8AD68F" stroke-width="2"/><rect x="40" y="17" width="16" height="5" rx="1" fill="#1E322D"/><circle cx="48" cy="29" r="3" fill="none" stroke="#1E322D" stroke-width="1.2"/><path d="M48 29l2.4-1.6" stroke="#D9622B" stroke-width="1.2"/></svg>',
	neu: '<svg viewBox="0 0 96 60"><rect x="6" y="25" width="30" height="10" rx="5" fill="#D5DCD8"/><rect x="60" y="25" width="30" height="10" rx="5" fill="#D5DCD8"/><rect x="38" y="14" width="20" height="32" rx="5" fill="none" stroke="#1E322D" stroke-width="2" stroke-dasharray="4 3"/><path d="M48 20v20M38 30h20" stroke="#1E322D" stroke-width="1.6"/></svg>',
	unk: '<svg viewBox="0 0 96 60"><rect x="6" y="25" width="84" height="10" rx="5" fill="#E3E8E5"/><circle cx="48" cy="30" r="14" fill="#fff" stroke="#C9D3CE" stroke-width="2"/><text x="48" y="36" text-anchor="middle" font-size="17" font-family="system-ui" fill="#5B6B66">?</text></svg>',
} as const;

/** The radiator sketches (`HK`) the Heizkostenverteiler step offers. */
export const RADIATORS = {
	platte:
		'<svg viewBox="0 0 96 60"><rect x="14" y="12" width="68" height="36" rx="3" fill="#fff" stroke="#1E322D" stroke-width="2"/><path d="M14 22h68M14 30h68M14 38h68" stroke="#C9D3CE" stroke-width="1.5"/></svg>',
	glieder:
		'<svg viewBox="0 0 96 60"><g fill="#fff" stroke="#1E322D" stroke-width="2"><rect x="16" y="10" width="9" height="40" rx="4"/><rect x="28" y="10" width="9" height="40" rx="4"/><rect x="40" y="10" width="9" height="40" rx="4"/><rect x="52" y="10" width="9" height="40" rx="4"/><rect x="64" y="10" width="9" height="40" rx="4"/></g></svg>',
} as const;
