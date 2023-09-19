import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Crossfit WOD API', version: '1.0.0' }
  },
  apis: [
    './src/swagger-docs/schemas.yaml',
    './src/user/UserRouter.ts',
    './src/auth/AuthRouter.ts'
  ]
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerDocs = (app: Express, port: number) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.log(
    'Version 1 docs are available at http://localhost:' + port + '/api/v1/docs'
  )
}

export default swaggerDocs
