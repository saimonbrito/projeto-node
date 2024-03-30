import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdexist } from '../middewares/check-session-id-exist'

export async function transactionsRouter(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdexist],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdexist],
    },
    async (request) => {
      const getTransctionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransctionsParamsSchema.parse(request.body)
      const { sessionId } = request.cookies
      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()
      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdexist],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transaction')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

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
