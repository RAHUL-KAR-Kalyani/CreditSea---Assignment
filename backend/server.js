// Entrypoint - connects to DB then starts app
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URI || 'mongodb+srv://rahulkar:0krKv65NkWnCdCy2@test.yuaqdqa.mongodb.net/?retryWrites=true&w=majority&appName=test';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB connected');
		app.listen(PORT, () => console.log('Server running on port', PORT));
	})
	.catch(err => {
		console.error('Mongo connection error:', err);
		process.exit(1);
	});
