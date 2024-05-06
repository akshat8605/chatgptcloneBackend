const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

const appSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Name is required!",
        },
        userId: {
            type: ObjectId,
            ref: "User",
            required:true
        },
        title:{
            type: String,
            required: "Title is required!",
        },
        shared:{
            type:Boolean,
            default:false
        },
        chats: [
                {
                    created: {
                        type: Date,
                        default: Date.now
                    },
                    message: {
                        type: String
                    },
                   messageId:{
                    type: ObjectId,
                    default:new mongoose.Types.ObjectId()
                   },
                   bot:{
                    type:Boolean,
                    default:false
                   }
                }
            ],
            
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("Chats", appSchema);