const Familymember = require('../models/familymember');
const Family = require('../models/family');
const isFamilyMember = require('../utilities/userIsFamilyMember');
const createNewMember = require('../utilities/createNewMember');
const { findById } = require('../models/familymember');
const upload = require('../utilities/multerupload');
const aws = require("aws-sdk");
const { none } = require('../utilities/multerupload');
const joinFamily = require('../utilities/joinFamily');
const storeMemory = require('../utilities/storeMemory');
const groupByPoster = require('../utilities/organizememorybyposter');
const s3 = new aws.S3();


module.exports.joinfamily = async (req, res) => {
    const user = req.user;
    //Check if user is already in the family, if the user is possibly already in the family
    //isFamilyMember will return the probable family member, 
    //otherwise it will save the new member to a new family and member will be undefined
    let member = await isFamilyMember(user);
    res.render('familymembers/joinfamily', { member, user });
}

module.exports.albumpostinput = async (req, res) => {
    const user = req.user;
    const page = "post";
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/albumnpost', { user, familymember, page });
}

module.exports.albumpostmemory = async (req, res) => {
    const { memorytext, date } = req.body;
    const { id } = req.params;
    const user = req.user;
    const userid = user._id;
    let file = req.file;
    await storeMemory(id, userid, memorytext, date, file);
    res.redirect(`/familymember/${id}/album`);
}



module.exports.album = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const page = "album";
    const familymember = await Familymember.findById(id).populate({
        path: 'memories',
        populate: {
            path: 'poster'
        }
    }).populate('poster');
    const memberMemoriesOrganized = groupByPoster(familymember);
    let signedUrlArray = familymember.memories.map(memory => {
        let params = { Bucket: "", Key: "" };
        if (memory.image.url) {
            params.Key = memory.image.key;
            params.Bucket = memory.image.bucket;
            return s3.getSignedUrl('getObject', params);
        }
        else {
            return "none";
        }
    })
    res.render('familymembers/testpage', { id, user, familymember, signedUrlArray, page, memberMemoriesOrganized });
    // res.render('familymembers/familymemberalbum', { id, user, familymember, signedUrlArray, page });
}

module.exports.addtofamily = async (req, res) => {
    const answer = req.body.join;
    const { id } = req.params;
    const user = req.user;
    if (answer === 'join') {
        await joinFamily(id, user);
        res.redirect(`/familymember/${id}/tree`);
    }
    else {
        const familymember = new Familymember({ first: user.first, last: user.last, email: user.email, userid: user._id });
        await familymember.save();
        const family = new Family([familymember._id]);
        await family.save();
        familymember.family = family._id;
        await familymember.save();
        user.family = family._id;
        user.familymember = familymember._id;
        await user.save();
        res.redirect(`/familymember/${id}/tree`);
    }
}


module.exports.index = async (req, res) => {
    const user = req.user;
    const page = "useralbum";
    const id = user.familymember;
    const familymember = await Familymember.findById(id).populate({
        path: 'memories',
        populate: {
            path: 'poster'
        }
    }).populate('poster');
    let signedUrlArray = familymember.memories.map(memory => {
        let params = { Bucket: "", Key: "" };
        if (memory.image.url) {
            params.Key = memory.image.key;
            params.Bucket = memory.image.bucket;
            return s3.getSignedUrl('getObject', params);
        }
        else {
            return "none";
        }
    })

    res.render('familymembers/familymemberalbum', { id, user, familymember, signedUrlArray, page });
}

module.exports.tree = async (req, res) => {
    const user = req.user;
    const page = "tree";
    const { id } = req.params;
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember, page });
}

module.exports.mytree = async (req, res) => {
    const user = req.user;
    const page = "tree";
    const { id } = req.params;
    const memberid = user.familymember;
    const familymember = await Familymember.findOne(memberid).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember, page });
}

module.exports.renderNewMemberForm = async (req, res) => {
    const user = req.user;
    const page = "newmember"
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/new', { user, familymember, page });
}

module.exports.addNewMember = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const page = "addmember";
    //fix - something wrong here inside of possible connections function
    const possibleConnections = await createNewMember(id, req.body.familymember);
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    if (possibleConnections.newConnections === true) {
        res.render('familymembers/checkconnections', { id, user, familymember, possibleConnections, page });
    }
    else {
        res.redirect(`/familymember/${id}/tree`);
    }
}


module.exports.checkConnectionsandUpdate = async (req, res) => {
    const { id, relationship } = req.params;
    const user = req.user;
    const page = "back";
    let spouse;
    let mother;
    let father;
    let familymember = await Familymember.findById(id);
    let family = familymember.family;
    const entirefam = req.body;
    let startsWithChild = /^child/;
    let startsWithSibling = /^sibling/;
    for (const property in entirefam) {
        if (startsWithChild.test(property)) {

            let child = JSON.parse(entirefam[property]);
            if (!child.answer) {
                const childMember = await Familymember.findById(child._id);
                if (relationship === "Father") {
                    childMember.father = familymember._id;
                } else {
                    childMember.mother = familymember._id;
                }
                await childMember.save();
                familymember.children.push(child._id);
            }
        }
        if (startsWithSibling.test(property)) {
            let sibling = JSON.parse(entirefam[property]);
            if (!sibling.answer) {
                const siblingMember = await Familymember.findById(sibling._id);
                siblingMember.siblings.push(familymember._id);
                await siblingMember.save();
                familymember.siblings.push(sibling._id);
            }
        }
    }

    if (req.body.spouse) {
        spouse = JSON.parse(req.body.spouse);
        if (!spouse.answer) {
            const spouseMember = await Familymember.findById(spouse._id);
            spouseMember.spouse = familymember._id;
            await spouseMember.save();
            familymember.spouse = spouse._id;
        }
    }
    if (req.body.mother) {
        mother = JSON.parse(req.body.mother);
        if (!mother.answer) {
            const motherMember = await Familymember.findById(mother._id);
            motherMember.children.push(familymember._id);
            await motherMember.save();
            familymember.mother = mother._id;
        }
    }
    if (req.body.father) {
        father = JSON.parse(req.body.father);
        if (!father.answer) {
            const fatherMember = await Familymember.findById(father._id);
            fatherMember.children.push(familymember._id);
            await fatherMember.save();
            familymember.father = father._id;
        }
    }



    await familymember.save();
    familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');

    res.render('familymembers/tree', { id, user, familymember, page });
}


