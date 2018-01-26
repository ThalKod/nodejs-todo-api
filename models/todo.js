const mongoose = require("mongoose");

module.exports = mongoose.model("Todo", {
    text: {
        type: String,
        minlength: 1
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});