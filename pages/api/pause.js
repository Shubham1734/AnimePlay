import connectDb from "@/middleware/mongoose";
import VideoPause from "@/models/videoTime";
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { videoId } = req.query;
        const { timestamp } = req.body;
        console.log('Received POST request with timestamp:', timestamp);
        console.log('Received POST request with timestamp:', videoId);
        res.status(200).json({ message: 'POST request received successfully' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
