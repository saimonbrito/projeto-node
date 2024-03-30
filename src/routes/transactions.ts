import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function transactionsRouter(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = knex('transactions').select()

    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getTransctionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransctionsParamsSchema.parse(request.body)
    const transaction = await knex('transactions').where('id', id).first()
    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transaction')
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })

  app.post('/', async (request, reply) => {
    const createTransactionsBorySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionsBorySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionid

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    await knex('trasnactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return reply.status(201).send()
  })
}
