import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'crypto'

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

app.listen({ port: 3333 }).then(() => {
  console.log('lets.. go watch')
})
