import connectDb from '@/middleware/mongoose';
import VideoTime from '@/models/videoTime';

connectDB();

export default async (req, res) => {
  const { videoId } = req.query;

  try {
    let videoTime = await VideoTime.findOne({ videoId });

    if (!videoTime) {
      console.log('No video time data found for videoId:', videoId);
      return res.status(404).json({ error: 'Video time data not found' });
    }

    // Return the updatedAt timestamp and the current time
    const updatedAt = videoTime.updatedAt.toISOString();
    const currentTime = videoTime.currentTime;

    res.status(200).json({ updatedAt, currentTime, videoId });
  } catch (error) {
    console.error('Error retrieving video time data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
