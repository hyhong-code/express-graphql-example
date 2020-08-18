const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

const axios = require("axios");

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parentVal, args) {
        const res = await axios.get(
          `http://localhost:3000/companies/${parentVal.id}/users`
        );
        return res.data;
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentVal, args) {
        const res = await axios.get(
          `http://localhost:3000/companies/${parentVal.companyId}`
        );
        return res.data;
      },
    },
  }),
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
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentVal, args) {
        try {
          const res = await axios.get(
            `http://localhost:3000/companies/${args.id}`
          );
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
