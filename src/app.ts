import express from 'express'
import { userRouter } from './user/UserRouter'
import { authRouter } from './auth/AuthRouter'
import { errorHandler } from './error/ErrorHandler'
import { tokenAuthentication } from './middlewares/tokenAuthentication'
export const app = express()

app.use(express.json())
app.use(authRouter)
app.use('/api/1.0/users', tokenAuthentication, userRouter)
app.use(errorHandler)
