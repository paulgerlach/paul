/** The shapes of `GeneratorFrame`: the file kinds and its texts. */
export type FileKind = "docx" | "pdf";

export type GeneratorTexts = {
	/** The preview's accessible name (the designs have none). */
	previewLabel: string;
	/** Under the preview's signature line. */
	signature: string;
	buttons: {
		docx: string;
		pdf: string;
		copy: string;
		busy: string;
		copied: string;
	};
	messages: { started: string; failed: string; copyFailed: string };
	legal: string;
};
