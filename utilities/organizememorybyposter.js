


function memoriesByPoster(poster, memories) {
    let postersMemories = memories.filter((memory) => {
        if (memory.poster === poster) return memory;
    });
    return postersMemories;
}

function organizeByPoster(memories) {
    let posters = [];
    let memoriesorganized = [];
    for (let memory of memories) {
        posters.push(memory.poster);
    }
    let uniquePosters = posters.filter((poster, index) => {
        return posters.indexOf(poster) === index;
    });
    for (let uniquePoster of uniquePosters) {
        let postersmemories = memoriesByPoster(uniquePoster, memories);
        memoriesorganized.push(postersmemories);
    }
    return memoriesorganized;
}

module.exports = function groupByPoster(familymember) {
    let memories = [];
    for (let memory of familymember.memories) {
        memories.push(memory);
    }
    return organizeByPoster(memories);
}