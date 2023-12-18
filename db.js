import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/scheduler').then(() => {
    console.log("db connected")
}).catch((err) => {
    console.log(err,"error in db")
});

const EmailSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  scheduledTime: Date,
  isSent: { type: Boolean, default: false },
});

const Email = mongoose.model('Email', EmailSchema);
export default Email