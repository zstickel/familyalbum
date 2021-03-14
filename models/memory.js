const mongoose = require('mongoose');
const { Schema } = mongoose;

const memorySchema = new Schema({
    familymember: {
        type: Schema.Types.ObjectId,
        ref: 'Familymember',
        required: [true, 'Memory must be associated with a family member']
    },
    description: {
        type: String,
        required: [true, 'Memory must be associated with a family member']
    },
    date: {
        type: Date,
        required: [true, 'Memory must be associated with a date']
    },
    image: {
        url: String,
        bucket: String,
        key: String
    },
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Memory must be posted by a user']
    }
});

module.exports = mongoose.model('Memory', memorySchema);