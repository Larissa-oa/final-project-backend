const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema ({
    sender_id: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true},
    recipient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true},
    message_body: { 
        type: String, 
        required: true},
    created_at: { 
        type: Date, 
        default: Date.now}
    })

        const MessageModel = mongoose.model('Message', messageSchema)

        module.exports = MessageModel
