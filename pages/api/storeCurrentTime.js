import connectDb from '@/middleware/mongoose';
import VideoTime from '@/models/videoTime';

connectDb();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { videoId, currentTime } = req.body;

    try {
      let videoTime = await VideoTime.findOne({ videoId });

      if (!videoTime) {
        videoTime = new VideoTime({
          videoId,
          currentTime,
        });
      } else {
        videoTime.currentTime = currentTime;
        videoTime.updatedAt = Date.now();
      }

      await videoTime.save();

      console.log('Video time data saved to MongoDB:', videoTime);

      res.status(200).json({ message: 'Current time stored successfully' });
    } catch (error) {
      console.error('Error storing video time data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
