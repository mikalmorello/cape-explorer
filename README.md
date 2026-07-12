# Cape Explorer

A web app for mapping and documenting Cape Cod activities — things we've
done and things we want to do.

## Stack

- React + Vite (JavaScript)
- Google Maps JS API (via `@vis.gl/react-google-maps`)

See `openspec/config.yaml` and `openspec/changes/` for the fuller plan and
in-progress work.

## Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your Google Maps API key
npm run dev
```

### Google Maps API key

The map needs a Google Maps JavaScript API key:

1. Create/select a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the "Maps JavaScript API".
3. Create an API key and restrict it to your local/deploy origins.
4. Put it in `.env.local` as `VITE_GOOGLE_MAPS_API_KEY`.

Without a key, the app still runs but shows a message in place of the map.
