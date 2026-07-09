import Elysia from "elysia";

const app = new Elysia();
app.get("/", () => {
  return { message: "this is root" };
});
console.log("server running")
app.listen(4000);
