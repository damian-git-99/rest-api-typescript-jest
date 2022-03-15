import { connectDB } from './src/config/database';
import { app } from './src/app';
import tokenService from './src/auth/TokenService';

connectDB();

tokenService.scheduleCleanupOldTokens();
app.listen(3000, () => console.log('app is running!'));
