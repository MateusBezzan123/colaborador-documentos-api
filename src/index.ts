import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { errorHandler } from './middlewares/errorHandler';
import routes from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Middleware de erro
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;