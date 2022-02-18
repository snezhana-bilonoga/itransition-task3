const express = require('express');
const config = require('config');
const mangoose = require('mongoose');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/registration', require('./routes/registration.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));

const PORT = config.get('port') || 5000;

async function start() {
    try {
        await mangoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        app.listen(PORT, () => console.log(`App has been started ${PORT}...`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}
start();
