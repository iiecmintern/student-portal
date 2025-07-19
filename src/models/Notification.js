const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

// Virtual field for number of readers (optional)
notificationSchema.virtual("readCount").get(function () {
  return this.readBy?.length || 0;
});

module.exports = mongoose.model("Notification", notificationSchema);
