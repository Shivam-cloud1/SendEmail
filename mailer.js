import nodemailer from 'nodemailer';
// import { MailSlurp } from "mailslurp-client"
import 'dotenv/config'
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jessy42@ethereal.email',
        pass: 'nnRCRDn5B53RmFzFg5'
    }
});

export default transporter

