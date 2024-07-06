const Queue = require('bull');
const twilioClient = require('../config/twilioClient');

const sendOtpQueue = new Queue('sendOtpQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

// Send Otp Queue Job
sendOtpQueue.process(async (job, done) => {
    const { msgData } = job.data;
    try {
        await twilioClient.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create(msgData)
        done();
    } catch (error) {
        done(error)
    }
})

module.exports = sendOtpQueue