const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/family-album';
const Familymember = require('../models/familymember');


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

const seedDB = async () => {
    await Familymember.deleteMany({});
    let member = new Familymember({
        first: 'Bethany',
        last: 'Baker',
        email: 'bethany.stickel@yahoo.com'
    });
    await member.save();
    let id = member._id;
    let spouse = new Familymember({
        first: 'Zane',
        last: 'Stickel',
        email: 'zstickel@hotmail.com',
        spouse: id
    });
    await spouse.save();
    let spouseid = spouse._id;
    member.spouse = spouseid;
    await member.save();
    let childone = new Familymember({
        first: 'Isaac',
        last: 'Stickel',
        email: 'istickel@hotmail.com',
        mother: id,
        father: spouseid
    });
    let childtwo = new Familymember({
        first: 'Selah',
        last: 'Stickel',
        email: 'sstickel@hotmail.com',
        mother: id,
        father: spouseid
    });
    await childone.save();
    childoneid = childone._id;
    childtwo.siblings.push(childoneid);
    await childtwo.save();
    childtwoid = childtwo._id;
    childone.siblings.push(childtwoid);
    await childone.save();

    member.children.push(childoneid);
    member.children.push(childtwoid);
    await member.save();
    spouse.children.push(childoneid);
    spouse.children.push(childtwoid);
    await spouse.save();

}

seedDB().then(() => {
    mongoose.connection.close();
});