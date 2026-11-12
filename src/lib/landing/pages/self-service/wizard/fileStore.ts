/**
 * The chosen files kept in this browser (the design's `FDB`: IndexedDB
 * `heidi_ss`, store `f`, key `files`), so "Fortsetzen" brings them back. A
 * `File` is stored as it is (structured clone); nothing leaves the browser.
 * Every call fails quietly: without IndexedDB the files just aren't kept.
 */
const DB = "heidi_ss";
const STORE = "f";
const KEY = "files";

export type StoredFiles = Record<string, File[]>;

function open(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		try {
			const r = indexedDB.open(DB, 1);
			r.onupgradeneeded = () => r.result.createObjectStore(STORE);
			r.onsuccess = () => resolve(r.result);
			r.onerror = () => reject(r.error);
		} catch (e) {
			reject(e);
		}
	});
}

/** Whether files can be kept here. */
export const filesKeepable = () =>
	open().then(
		(db) => {
			db.close();
			return true;
		},
		() => false,
	);

function run(mode: IDBTransactionMode, job: (s: IDBObjectStore) => void) {
	return open()
		.then(
			(db) =>
				new Promise<void>((resolve) => {
					const tx = db.transaction(STORE, mode);
					job(tx.objectStore(STORE));
					tx.oncomplete =
						tx.onerror =
						tx.onabort =
							() => {
								db.close();
								resolve();
							};
				}),
		)
		.catch(() => {});
}

export const saveFiles = (files: StoredFiles) =>
	run("readwrite", (s) => s.put(files, KEY));

export const clearFiles = () => run("readwrite", (s) => s.delete(KEY));

export function loadFiles(): Promise<StoredFiles | null> {
	return open()
		.then((db) =>
			new Promise<StoredFiles | null>((resolve) => {
				try {
					const q = db.transaction(STORE).objectStore(STORE).get(KEY);
					q.onsuccess = () => resolve((q.result as StoredFiles) ?? null);
					q.onerror = () => resolve(null);
				} catch {
					resolve(null);
				}
			}).finally(() => db.close()),
		)
		.catch(() => null);
}
