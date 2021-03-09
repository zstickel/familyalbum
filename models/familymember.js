const mongoose = require('mongoose');
const { Schema } = mongoose;

const familyMemberSchema = new Schema({
    first: {
        type: String,
        required: [true, 'Must have a first name']
    },
    last: {
        type: String,
        required: [true, 'Must have a last name']
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    family: {
        type: Schema.Types.ObjectId,
        ref: 'Family'
    },
    email: {
        type: String,
    },
    mother: {
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    },
    father: {
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    },
    spouse: {
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    },
    siblings: [{
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    }],
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    }]
});

module.exports = mongoose.model('Familymember', familyMemberSchema);