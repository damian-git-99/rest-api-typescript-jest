import { connectDB } from './src/config/database';
import { app } from './src/app';

connectDB();

app.listen(3000, () => console.log('app is running!'));
