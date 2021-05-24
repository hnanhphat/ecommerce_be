const Reaction = require("../models/Reaction");
const mongoose = require("mongoose");

const reactionController = {};

reactionController.createReaction = async (req, res, next) => {
  try {
    // 1. Get the value from req.body
    const { targetType, targetId, emoji } = req.body;

    // 2. Check if that target Id is exist
    const targetObj = await mongoose.model(targetType).findById(targetId);
    if (!targetObj) {
      throw new Error(`${targetType} not found`);
    }

    // 3. Check if that reaction is exist
    let reaction = await Reaction.findOne({
      user: req.userId,
      targetType,
      targetId,
    });
    let message = "";

    // 4. If reaction is not exist, create new one
    if (!reaction) {
      const newReaction = new Reaction({
        user: req.userId,
        targetType,
        targetId,
        emoji,
      });
      await newReaction.save();
      message = "Add reaction successful";
    } else {
      // 5. If reaction is exist
      if (reaction.emoji !== emoji) {
        // 5-1. If exist reaction is different with upcoming reaction then update
        await Reaction.findOneAndUpdate({ _id: reaction._id }, { emoji });
        message = "Update reaction successful";
      } else {
        // 5-2. If its same -> delete
        await Reaction.findOneAndDelete({ _id: reaction._id });
        message = "Remove reaction successful";
      }
    }

    // 6. Update the reaction status (calculate reaction) => in reaction model
    // 7. Response
    const reactionState = await mongoose
      .model(targetType)
      .findById(targetId, "reactions");

    res.status(200).json({
      success: true,
      data: reactionState.reactions,
      message: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = reactionController;
