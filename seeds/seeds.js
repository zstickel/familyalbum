const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/family-album';
const Familymember = require('../models/familymember');
const User = require('../models/user');
const Family = require('../models/family');
const Memory = require('../models/memory');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


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

const emptyBucket = async () => {

    const { Contents } = await s3.listObjects({ Bucket: "zanefamilyalbum" }).promise();
    if (Contents.length > 0) {
        await s3
            .deleteObjects({
                Bucket: "zanefamilyalbum",
                Delete: {
                    Objects: Contents.map(({ Key }) => ({ Key }))
                }
            })
            .promise();
    }
    const { newContents } = await s3.listObjects({ Bucket: "zanefamilyalbum" }).promise();
    console.log(newContents);

}

const seedDB = async () => {
    await User.deleteMany({});
    await Familymember.deleteMany({});
    await Familymember.deleteMany({});
    await Memory.deleteMany({});
    let member = new Familymember({
        first: 'Bethany',
        last: 'Baker',
        email: 'bethany.stickel@yahoo.com'
    });
    await member.save();
    let id = member._id;
    let family = new Family({ members: [id] });

    await family.save();
    const familyid = family._id;
    member.family = familyid;
    let spouse = new Familymember({
        first: 'Zane',
        last: 'Stickel',
        email: 'zstickel@hotmail.com',
        spouse: id,
        family: familyid
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
        father: spouseid,
        family: familyid
    });
    let childtwo = new Familymember({
        first: 'Selah',
        last: 'Stickel',
        email: 'sstickel@hotmail.com',
        mother: id,
        father: spouseid,
        family: familyid
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
    family.members.push(spouse._id, childone._id, childtwo._id);
    await family.save();
    console.log(member, spouse, childone, childtwo, family);

}
emptyBucket();
seedDB().then(() => {
    mongoose.connection.close();
});