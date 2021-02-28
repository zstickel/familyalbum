const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    first: {
        type: String,
        required: [true, 'Must have a first name']
    },
    last: {
        type: String,
        required: [true, 'Must have a last name']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    familymember: {
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    }
})

userSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', userSchema);