import { buildSchema } from "type-graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServer } from "apollo-server-fastify";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import fastify, { FastifyInstance } from "fastify";
import UserResolver from "../modules/user/user.resolver";
import { GraphQLSchema, execute, subscribe } from "graphql";

export async function createServer() {
  const app = fastify();

  function fastifyAppClonePlugin(app: FastifyInstance): ApolloServerPlugin {
    return {
      async serverWillStart() {
        console.log("SERVER  WILL START");
        return {
          async drainServer() {
            console.log("DRAIN SERVER");
            await app.close();
          },
        };
      },
    };
  }

  function buildContext() {}

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClonePlugin(app),
      ApolloServerPluginDrainHttpServer({
        httpServer: app.server,
      }),
    ],

    context: buildContext,
  });

  return { app, server };

  const subscriptionServer = ({
    schema,
    server,
  }: {
    schema: GraphQLSchema;
    server: ApolloServer;
  }) => {
    return SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        async onConnect(connectionParams: Object) {
          return buildContext({ connectionParams });
        },
      },
      {
        server,
        path: "/graphql",
      }
    );
  };
}
