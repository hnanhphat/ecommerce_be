const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: false, default: "" },
    genre: { type: String, required: false, default: "" },
    elementEN: { type: String, required: false },

    introduceEN: { type: String, required: false },
    overviewEN: { type: String, required: false },
    workEN: { type: String, required: false },
    loveEN: { type: String, required: false },
    financeEN: { type: String, required: false },
    healthEN: { type: String, required: false },
    mentalityEN: { type: String, required: false },

    introduceReversedEN: { type: String, required: false },
    overviewReversedEN: { type: String, required: false },
    workReversedEN: { type: String, required: false },
    loveReversedEN: { type: String, required: false },
    financeReversedEN: { type: String, required: false },
    healthReversedEN: { type: String, required: false },
    mentalityReversedEN: { type: String, required: false },

    elementVN: { type: String, required: false },

    introduceVN: { type: String, required: false },
    overviewVN: { type: String, required: false },
    workVN: { type: String, required: false },
    loveVN: { type: String, required: false },
    financeVN: { type: String, required: false },
    healthVN: { type: String, required: false },
    mentalityVN: { type: String, required: false },

    introduceReversedVN: { type: String, required: false },
    overviewReversedVN: { type: String, required: false },
    workReversedVN: { type: String, required: false },
    loveReversedVN: { type: String, required: false },
    financeReversedVN: { type: String, required: false },
    healthReversedVN: { type: String, required: false },
    mentalityReversedVN: { type: String, required: false },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
