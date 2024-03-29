import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRouter(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions')
      .where('amount', 1000)
      .select('*')

    return transactions
  })
}
