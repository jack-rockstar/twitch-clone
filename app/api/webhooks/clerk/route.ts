import { db } from '@/prisma/db'
import { type WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get the ID and type
  const eventType = evt.type

  console.log('[REQUEST WEBHOOK]', body)

  if (eventType === 'user.created') {
    const { id, username, image_url: imageUrl } = payload.data

    await db.user.create({
      data: {
        externalUserId: id,
        username,
        imageUrl

      }
    })
  }

  if (eventType === 'user.updated') {
    const { id, username, image_url: imageUrl } = payload.data

    await db.user.update({
      data: {
        imageUrl,
        username
      },
      where: {
        externalUserId: id
      }

    })
  }

  if (eventType === 'user.deleted') {
    await db.user.delete({
      where: {
        externalUserId: payload.data.id
      }
    })
  }

  return new Response('', { status: 200 })
}
