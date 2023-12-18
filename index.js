import express from 'express';
import bodyParser from 'body-parser';
import Email from "./db/db.js";
import transporter from "./mailer/mailer.js"
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


// Create
app.post('/schedule', async (req, res) => {
    try {
        const email = await Email.create(req.body);
        res.status(201).json(email);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read
app.get('/schedule/:id', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ error: 'Email not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// List
app.get('/schedule', async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update
app.put('/schedule/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!email) {
            return res.status(404).json({ error: 'Id not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete
app.delete('/schedule/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ error: 'Id not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/schedule/:id/send', async (req, res) => {
    const email = await Email.findById(req.params.id);
    try {

        const mailOptions = {
            from: 'jessy42@ethereal.email',
            to: email.to,
            subject: email.subject,
            text: email.body,
        };

        transporter.sendMail(mailOptions).then(async () => {
            email.isSent = true;
            await email.save();
            res.json({ message: 'Email sent successfully' });
        }).catch(async (error) => {
            console.log(error,"error in smtp")
            email.isSent = false;
            await email.save();

            res.status(500).json({ error: 'Internal Server Error' });
        })
    } catch (error) {
        email.isSent = false;
        await email.save();

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
