const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = require("graphql");

const axios = require("axios");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentVal, args) {
        try {
          const res = await axios.get(`http://localhost:3000/users/${args.id}`);
          return res.data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
