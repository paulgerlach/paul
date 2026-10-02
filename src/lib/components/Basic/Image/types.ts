/** Shape of a `?enhanced` import (vite-imagetools `Picture`), also used for SVGs. */
export type ImageAsset = {
	sources: Record<string, string>;
	img: { src: string; w: number; h: number };
};
