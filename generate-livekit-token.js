import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();
// Make sure you have these in your .env file!
// DO NOT use VITE_ prefix for the secret, as that exposes it to the browser!
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
if (!apiKey || !apiSecret) {
    console.error('Error: LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in your .env file');
    process.exit(1);
}
const roomName = 'biology-class-101';
const participantName = 'Teacher';
// Create a new token for the teacher
const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: '24h', // Token is valid for 24 hours
});
at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
const token = await at.toJwt();
console.log('\n--- YOUR LIVEKIT TOKEN ---');
console.log(token);
console.log('--------------------------\n');
console.log('Copy the token above and put it in your .env file as:');
console.log(`VITE_LIVEKIT_TOKEN="${token}"`);