if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ejsMate = require('ejs-mate');
const path = require('path');
const familyMemberRoutes = require('./routes/familymembers');
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;


db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrapcss', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use('/bootstrapjs', express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.use('/familymember', familyMemberRoutes);


app.get('/', (req, res) => {
    const user = 'Bethany';
    res.render('home', { user });
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

