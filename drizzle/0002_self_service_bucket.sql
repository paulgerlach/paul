-- The Zählercheck's uploads (/self-service): private, so files are read only
-- through signed URLs the server makes; uploads go to signed upload URLs too.
-- 20 MB per file; PDFs, images and the device list's spreadsheets.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
	'self-service',
	'self-service',
	false,
	20971520,
	ARRAY[
		'application/pdf',
		'image/*',
		'text/csv',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	]
)
ON CONFLICT (id) DO NOTHING;
