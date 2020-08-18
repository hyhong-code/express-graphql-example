const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
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
        try {
          const res = await axios.get(
            `http://localhost:3000/companies/${parentVal.id}/users`
          );
          return res.data;
        } catch (error) {
          console.error(error);
        }
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
        try {
          const res = await axios.get(
            `http://localhost:3000/companies/${parentVal.companyId}`
          );
          return res.data;
        } catch (error) {
          console.error(error);
        }
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

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      async resolve(parentVal, { firstName, age, companyId }) {
        try {
          const res = await axios.post(`http://localhost:3000/users/`, {
            firstName,
            age,
          });
          return res.data;
        } catch (error) {
          console.error(error);
        }
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentVal, { id }) {
        try {
          const res = await axios.delete(`http://localhost:3000/users/${id}`);
          return res.data;
        } catch (error) {
          console.error(error);
        }
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      async resolve(parentVal, args) {
        try {
          const res = await axios.patch(
            `http://localhost:3000/users/${args.id}`,
            args
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
  mutation: RootMutation,
});
