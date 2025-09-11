import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    song: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

musicSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Music = mongoose.model('Music', musicSchema);
export default Music;
