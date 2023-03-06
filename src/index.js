import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true
});
fastify.register(import('@fastify/cookie'));

const checkCensor = (str, reply) => {
  if (str.toLowerCase().includes('fuck')) {
    return reply.status(403).send('unresolved');
  }
  return reply.send(str);
}

fastify.post('/uppercase', (request, reply) => {
  const str = request.body.toUpperCase();
  checkCensor(str, reply)
});

fastify.post('/lowercase', (request, reply) => {
  const str = request.body.toLowerCase();
  checkCensor(str, reply)
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;
  const user = users[id];
  if (!user) {
    return reply.status(400).send('User not exist');
  }
  return reply.send(users[id]);
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;
  if (!filter && !value) {
    return reply.send(Object.values(users));
  }
  return reply.send(
    Object.values(users).filter((user) => String(user[filter]) === value)
  );
});

export default fastify;
