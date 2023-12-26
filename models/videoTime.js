// models/VideoTime.js
import mongoose from 'mongoose';

const videoTimeSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const VideoTime = mongoose.models.VideoTime || mongoose.model('VideoTime', videoTimeSchema);

export default VideoTime;
