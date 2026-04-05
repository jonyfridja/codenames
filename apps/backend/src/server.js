import { createApp } from "./app.js";

const app = createApp();
const port = process.env.PORT || 3000;
console.debug(`PORT env var: ${process.env.PORT}`);
console.debug(`port: ${port}`);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
