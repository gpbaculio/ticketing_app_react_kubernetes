import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan
  get client() {
    if (!this._client)
      throw new Error('Cannot access NATS client before connecting')
    else
      return this._client
  }
  connect(clusterId: string, cliendId: string, url: string) {
    this._client = nats.connect(clusterId, cliendId, { url })

    return new Promise((resolve, reject) => {
      this._client!.on(
        'connect',
        () => {
          console.log('Connected to NATS')
          resolve()
        }
      )
      this._client!.on(
        'error',
        (error) => {
          reject(error)
        }
      )
    })
  }
}

export const natsWrapper = new NatsWrapper()