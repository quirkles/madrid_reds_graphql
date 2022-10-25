import 'reflect-metadata'

import { startServer } from './server'

async function main () {
  await startServer()
}

main()
  .then(() => {
        console.log("Started app.") //eslint-disable-line
  })
  .catch(err => {
        console.error(err) //eslint-disable-line
  })
