const mongoose = require("mongoose");

module.exports = mongoose.model("Todo", {
    text: {
        type: String,
        minlength: 1,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    }
});