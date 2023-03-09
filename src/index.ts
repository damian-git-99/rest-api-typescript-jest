import { connectDB } from './config/database';
import { app } from './app';
import tokenService from './auth/TokenService';

connectDB();

tokenService.scheduleCleanupOldTokens();
app.listen(3000, () => console.log('app is running!'));
