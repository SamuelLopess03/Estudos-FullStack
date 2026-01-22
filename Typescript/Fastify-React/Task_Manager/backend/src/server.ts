import fastify from "fastify";

const server = fastify({
  logger: true,
});

server.get("/", async (_, reply) => {
  reply.send({ message: "Server is running!" });
});

server.listen({ port: 3000, host: "0.0.0.0" });
