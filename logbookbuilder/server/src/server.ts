import app from "./app.js";

const port = Number(process.env.PORT ?? 5000);

app.listen(port, () => {
  console.log(`\n🗂  Logbook Builder API`);
  console.log(`   Listening on http://localhost:${port}`);
  console.log(`   Health → http://localhost:${port}/health\n`);
});
