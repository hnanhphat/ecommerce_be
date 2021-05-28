const Card = require("../models/Card");

const cardController = {};

// Create a new news
cardController.createCard = async (req, res, next) => {
  try {
    const {
      title,
      image,
      elementEN,
      introduceEN,
      overviewEN,
      workEN,
      loveEN,
      financeEN,
      healthEN,
      mentalityEN,
      introduceReversedEN,
      overviewReversedEN,
      workReversedEN,
      loveReversedEN,
      financeReversedEN,
      healthReversedEN,
      mentalityReversedEN,
      elementVN,
      introduceVN,
      overviewVN,
      workVN,
      loveVN,
      financeVN,
      healthVN,
      mentalityVN,
      introduceReversedVN,
      overviewReversedVN,
      workReversedVN,
      loveReversedVN,
      financeReversedVN,
      healthReversedVN,
      mentalityReversedVN,
    } = req.body;

    const card = new Card({
      title,
      image,
      elementEN,
      introduceEN,
      overviewEN,
      workEN,
      loveEN,
      financeEN,
      healthEN,
      mentalityEN,
      introduceReversedEN,
      overviewReversedEN,
      workReversedEN,
      loveReversedEN,
      financeReversedEN,
      healthReversedEN,
      mentalityReversedEN,
      elementVN,
      introduceVN,
      overviewVN,
      workVN,
      loveVN,
      financeVN,
      healthVN,
      mentalityVN,
      introduceReversedVN,
      overviewReversedVN,
      workReversedVN,
      loveReversedVN,
      financeReversedVN,
      healthReversedVN,
      mentalityReversedVN,
    });
    await card.save();

    res.status(200).json({
      success: true,
      data: card,
      message: "Create new card successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of cards
cardController.getListOfCards = async (req, res, next) => {
  try {
    const { title, ...filter } = req.query;
    const cards = await Card.find({
      title: new RegExp(title, "i"),
      ...filter,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { cards },
      message: "Get list of cards successful",
    });
  } catch (error) {}
};

cardController.getRandomCard = async (req, res, next) => {
  try {
    const count = req.params.count;
    const totalCard = await Card.countDocuments();
    let cards;
    console.log(count);
    if (count == 1) {
      const random = Math.floor(Math.random() * totalCard);
      cards = await Card.findOne().skip(random);
    } else {
      cards = [];
      for (let i = 0; i < count; i++) {
        const random = Math.floor(Math.random() * totalCard);
        const card = await Card.findOne().skip(random);
        cards.push(card);
      }
    }

    res.status(200).json({
      success: true,
      data: cards,
      message: "Get random card successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = cardController;
