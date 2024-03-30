import fastify from 'fastify'
import { env } from './env'
import { transactionsRouter } from './routes/transactions'

const app = fastify()

app.register(transactionsRouter, {
  prefix: 'transactions',
})

// app.get('/', async () => {
//   const transactions = await knex('transactions')
//     .insert({
//       id: randomUUID(),
//       title: 'Transaçao2 sengindo tets',
//       amount: 2000,
//     })
//     .returning('*')

//   return transactions
// })

// app.get('/', async () => {
//   const transactions = await knex('transactions')
//     .where('amount', 1000)
//     .select('*')

//   return transactions
// })

app.listen({ port: env.PORT }).then(() => {
  console.log('lets.. go watch')
})
