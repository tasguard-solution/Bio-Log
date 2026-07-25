import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
app.get('/api/token', (req, res) => {
    if (!apiKey || !apiSecret) {
        return res.status(500).json({ error: 'LiveKit API key or secret is missing in .env' });
    }
    const { room, username, isTeacher } = req.query;
    if (!room || !username) {
        return res.status(400).json({ error: 'Missing room or username' });
    }
    try {
        const at = new AccessToken(apiKey, apiSecret, {
            identity: String(username),
            ttl: '10m', // Token expires in 10 minutes for security
        });
        // If teacher, they can publish. If student, they cannot publish video (we control mic via hand raise, but LiveKit permissions can just allow publish and we mute them in the UI)
        const canPublish = isTeacher === 'true';
        at.addGrant({
            roomJoin: true,
            room: String(room),
            canPublish: canPublish,
            canSubscribe: true
        });
        const token = at.toJwt();
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`LiveKit Token Server running on http://localhost:${PORT}`);
    console.log(`Make sure LIVEKIT_API_KEY and LIVEKIT_API_SECRET are in your .env`);
});