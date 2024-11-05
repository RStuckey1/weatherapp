import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('path/to/client/dist'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use('/api', routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
