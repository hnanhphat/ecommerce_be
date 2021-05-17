const Decks = require("../models/Decks");

const decksController = {};

// Create a new decks
decksController.createDecks = async (req, res, next) => {
  try {
    const {
      images,
      name,
      sale,
      defaultPrice,
      description,
      oficialPrice,
      genres,
      size,
      color,
    } = req.body;

    const decks = new Decks({
      images,
      name,
      sale,
      description,
      defaultPrice,
      oficialPrice,
      genres,
      size,
      color,
    });
    await decks.save();

    res.status(200).json({
      success: true,
      data: decks,
      message: "Create new decks successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of decks
decksController.getListOfDecks = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, name, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total decks number
    const totalDecks = await Decks.countDocuments({ ...filter });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalDecks / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get decks based on query info
    const decks = await Decks.find({ name: new RegExp(name, "i"), ...filter })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    // 6. Send decks + totalPages info
    res.status(200).json({
      success: true,
      data: { decks: decks, totalPages },
      message: "Get list of decks successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single decks
decksController.getSingleDecks = async (req, res, next) => {
  try {
    const decks = await Decks.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: decks,
      message: "Get single decks successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a single decks
decksController.updateSingleDecks = async (req, res, next) => {
  try {
    const {
      images,
      name,
      sale,
      defaultPrice,
      description,
      oficialPrice,
      genres,
      size,
      color,
    } = req.body;
    const decks = await Decks.findByIdAndUpdate(
      req.params.id,
      {
        images,
        name,
        sale,
        description,
        defaultPrice,
        oficialPrice,
        genres,
        size,
        color,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: decks,
      message: "Update decks successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a single decks
decksController.deleteSingeleDecks = async (req, res, next) => {
  try {
    const decks = await Decks.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: decks,
      message: "Delete decks successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = decksController;
