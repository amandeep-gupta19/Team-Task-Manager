import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const preferredPort = Number(process.env.PORT || 5055);
const isProd = process.env.NODE_ENV === "production";

/**
 * Binds `server` to a port, retrying the next port in development when the
 * preferred port is still held by a previous `node --watch` / stray process.
 */
function listenHttpServer(server, startPort) {
  const maxPort = isProd ? startPort : startPort + 25;
  let port = startPort;

  return new Promise((resolve, reject) => {
    function tryPort() {
      server.once("error", onListenError);
      server.listen(port, () => {
        server.removeListener("error", onListenError);
        resolve(port);
      });
    }

    function onListenError(err) {
      server.removeListener("error", onListenError);
      if (err.code === "EADDRINUSE" && port < maxPort) {
        if (!isProd) {
          console.warn(
            `Port ${port} is busy; trying ${port + 1} (stop extra "npm run dev" or set PORT in server/.env).`
          );
        }
        port += 1;
        setImmediate(tryPort);
        return;
      }
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the other process or set PORT in server/.env. On macOS, port 5000 is often taken by AirPlay (Control Center).`
        );
      } else {
        console.error("HTTP server error", err);
      }
      reject(err);
    }

    tryPort();
  });
}

async function startServer() {
  await connectDatabase();

  const server = http.createServer(app);
  const port = await listenHttpServer(server, preferredPort);

  if (port !== preferredPort) {
    console.warn(
      `Server is on port ${port} (not ${preferredPort}). Point the client at http://localhost:${port}/api (e.g. VITE_API_URL in client/.env).`
    );
  }

  console.log(`Server listening on port ${port}`);
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
