import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const serverRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const monorepoRoot = path.resolve(serverRoot, "..");

// npm workspaces run the server with cwd=server/, so load root .env explicitly.
dotenv.config({ path: path.join(monorepoRoot, ".env") });
dotenv.config({ path: path.join(serverRoot, ".env") });
