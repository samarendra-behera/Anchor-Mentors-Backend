const Queue = require('bull');
const nodemailer = require("nodemailer");

const emailQueue = new Queue('emailQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Email Queue Job
emailQueue.process(async (job, done) => {
    const { mailOptions } = job.data;
    try {
        await transporter.sendMail(mailOptions);
        done();
    } catch (error) {
        done(error)
    }
})

module.exports = emailQueue


