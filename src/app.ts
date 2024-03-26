import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'crypto'
import { env } from './env'

const app = fastify()

// app.get('/', async () => {
//   const transactions = await knex('transactions')
//     .insert({
//       id: randomUUID(),
//       title: 'Transaçao2 sengindo tets',
//       amount: 1000,
//     })
//     .returning('*')

//   return transactions
// })

app.get('/', async () => {
  const transactions = await knex('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
})

app.listen({ port: env.PORT }).then(() => {
  console.log('lets.. go watch')
})
