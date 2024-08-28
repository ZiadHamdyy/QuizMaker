import express from 'express';
import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet'
import quiz from './quiz';
import solved from './solved';
import user from './user';
import auth from './Auth'
import AuthToken from './Auth/Authorization';

const allowedOrigins = ['http://localhost:5173']; // Your frontend URL

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
};

dotenv.config();

function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use((req, res, next) => {
    req.setTimeout(600000);
    res.setTimeout(600000);
    next();
  });

  app.use(cors(corsOptions));

  app.use(helmet())
  app.use(express.json({ limit: '100mb'}));
  app.use(cookieParser());
  const limiter = rateLimit({
    max: 1500,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
  })
  app.use('/api', limiter);
  app.get('/', (req, res) => {
    return res.json({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
  });

  const apiRouter = express.Router();

  apiRouter.use('/quiz', AuthToken, quiz);
  apiRouter.use('/solved', AuthToken, solved);
  apiRouter.use('/user', AuthToken, user);
  apiRouter.use('/auth', auth)
  app.use('/api/v1', apiRouter);
  
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  app.use((err, req, res, _next) => {
    res.status(err.status).json({ message: err.message });
  });

  app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
  });
}

export default main;

