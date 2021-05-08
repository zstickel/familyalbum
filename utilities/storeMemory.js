const Familymember = require('../models/familymember');
const Memory = require('../models/memory');


module.exports = async function storeMemory(id, userid, memorytext, date, file) {
    let memory = {};
    let familymember = await Familymember.findById(id);
    if (file) {
        const { location, bucket, key } = file;
        memory = new Memory({
            familymember: id, description: memorytext, date: date, poster: userid,
            image: { url: location, bucket: bucket, key: key }
        });
    }
    else {
        memory = new Memory({
            familymember: id, description: memorytext, date: date, poster: userid
        });
    }
    await memory.save();
    familymember.memories.push(memory._id);
    await familymember.save();

}