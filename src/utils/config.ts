const { NODE_ENV, PORT = 3000, DB, JWT_SECRET } = process.env;

const DB_DEV = 'mongodb://127.0.0.1:27017/irkcomposersdb';
const JWT_SECRET_DEV = 'dev-key';

export { NODE_ENV, PORT, DB, JWT_SECRET, DB_DEV, JWT_SECRET_DEV };
