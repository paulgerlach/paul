# csv-to-telegram

### This tool decodes telegrams stored in CSV files, and optionally uploads them to a supabase instance. 

## Dependencies
Requires `bun`.

## Environment
Requires 3 fields in `.env` in the root directory:

```.env
TELEGRAM_DECRYPTION_KEY="..."
SUPABASE_URL="http://127.0.0.1:50502 "
SUPABASE_SECRET_KEY="..."
```


## Usage:

```bash
bun decode -i <input csv> -v -u
```

-i is the only required argument, and must specify a valid path to a .csv file.

-v is for verbosity, no arguments, optional.

-u is to upload the results to the target supabase instance. no arguments, optional.



## Examples

Decode and upload.
```bash
bun decode -i All_telgrams_2026-02-27.csv -u
```

Just decode and log.
```bash
bun decode -i All_telgrams_2026-02-27.csv
```