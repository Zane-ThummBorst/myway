const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");
const {validUserObject} = ("./fieldValidations");
//const {getUserById} = ("./users");

async function addSong(user, songName, artistName, dislikeFlag=false) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!songName) {
        throw "Song name not provided";
    }
    if(typeof songName != "string") {
        throw "Song's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    if(typeof dislikeFlag != "boolean") {
        throw "If provided, dislike flag should be a boolean";
    }
    
    let currentSongList = user.favorites.songs;
    for(let i = 0; i < currentSongList.length; i++) { //Make sure song isn't in the list already
        if(songName == currentSongList[i].songName && artistName == currentSongList[i].artistName) {
            throw "This song is already on your list."
        }
    }

    user.favorites.songs.push({songName: songName, artistName: artistName, disliked: dislikeFlag});

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not add the song to the user's list";
    }
    
    return user;
}

async function removeSong(user, songName, artistName) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!songName) {
        throw "Song's name not provided";
    }
    if(typeof songName != "string") {
        throw "Song's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let currentSongList = user.favorites.songs;
    let songFound = false;
    for(let i = 0; i < currentSongList.length; i++) { //Make sure song is in the list already
        if(songName == currentSongList[i].songName && artistName == currentSongList[i].artistName) { 
            songFound = true;
            user.favorites.songs.splice(i, 1);
            break;
        }
    }
    if(!songFound) {
        throw "Song not found in list";
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not remove the song to the user's list";
    }
    
    return user;
}

module.exports = {addSong, removeSong};