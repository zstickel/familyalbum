const mongoose = require('mongoose');
const { Schema } = mongoose;

const familySchema = new Schema({
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Familymember'
    }]
});

module.exports = mongoose.model('Family', familySchema);
