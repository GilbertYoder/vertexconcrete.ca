// @ts-check
import { defineConfig } from 'astro/config';

// Hosts allowed to reach the dev/preview server (e.g. tunnels, LAN names).
// Add or remove entries as needed. A leading dot allows all subdomains,
// e.g. '.ngrok-free.app'. Set to `true` to allow any host (not recommended).
const allowedHosts = [
  'localhost',
  "witness-spanking-performer-prison.trycloudflare.com",
  // 'vertexconcrete.ca',
  // '.vertexconcrete.ca',
];

// https://astro.build/config
export default defineConfig({
  vite: {
    server: { allowedHosts },
    preview: { allowedHosts },
  },
});
