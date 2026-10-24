/**
 * The legal pages (/impressum, /datenschutzhinweise, /agb) share one design:
 * a hero with pill, H1 and lead over the `/heizkostenverordnung` guide's table of
 * contents and article cards (`.lf-g`), with the legal page's own blocks
 * (`.lg-h3`, `.lg-list`, `.lg-doc`, `.lg-stand`, `.lg-nr`).
 */

/** One block of an article. Strings may hold trusted markup. */
export type LegalBlock =
	/** A paragraph; `nr` is its clause number (`.lg-nr`, e.g. "1.1"). */
	| { p: string; nr?: string }
	/** A clause heading (`.lg-h3`, e.g. "A 1 Geltungsbereich …"). */
	| { h3: string }
	/** The document's name under the article's H2 (`.lg-doc`). */
	| { doc: string }
	/** The date line at the end of a document (`.lg-stand`). */
	| { stand: string }
	/** A bullet list (`.lg-list`). */
	| { list: string[] };

export type LegalArticle = {
	/** The anchor (`s-…`), also the table of contents' link. */
	id: string;
	/** "01", "02" … */
	num: string;
	/** The H2, also the table of contents' entry. */
	title: string;
	/** The green badge beside the number (`.lf-par`). */
	law?: string;
	body: LegalBlock[];
};

export type LegalPage = {
	pill: string;
	h1: string;
	lead: string;
	/** The articles section's accessible name. */
	label: string;
	articles: LegalArticle[];
};
