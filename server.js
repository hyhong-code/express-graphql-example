const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const app = express();

app.post(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Listening");
});
