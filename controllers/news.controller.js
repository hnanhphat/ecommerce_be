const News = require("../models/News");
const Review = require("../models/Review");

const newsController = {};

// Create a new news
newsController.createNews = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { images, title, content, category } = req.body;

    const news = new News({
      images: images,
      title: title,
      content: content,
      author: userId,
      category: category,
    });
    await news.save();

    res.status(200).json({
      success: true,
      data: news,
      message: "Create new news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single news
newsController.getSingleNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).populate("author");
    news.reviews = await Review.find({ targetId: news._id }).populate("author");

    res.status(200).json({
      success: true,
      data: news,
      message: "Get single news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of news
newsController.getListOfNews = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, title, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total news number
    const totalNews = await News.countDocuments({
      title: new RegExp(title, "i"),
      ...filter,
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalNews / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get news based on query info
    let news = await News.find({
      title: new RegExp(title, "i"),
      ...filter,
    })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("author");
    // .populate({ path: "reviews.author", model: "User" });

    await Promise.all(
      news.map(async (item) => {
        item.reviews = await Review.find({ targetId: item._id }).populate(
          "author"
        );
      })
    );

    const categories = await News.aggregate([
      { $group: { _id: "$category", cound: { $sum: 1 } } },
    ]).sort({ _id: -1 });

    // 6. Send news + totalPages info
    res.status(200).json({
      success: true,
      data: { news: news, totalPages, categories },
      message: "Get list of news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a single news
newsController.updateSingleNews = async (req, res, next) => {
  try {
    // const userId = req.userId;
    // const newsAuthor = await News.findById(req.params.id);
    const { images, title, content } = req.body;

    // if (newsAuthor.author != userId) {
    //   throw new Error("You cannot edit the other user's news");
    // }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      {
        images: images || [],
        title: title,
        content: content,
        // author: userId,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: news,
      message: "Update news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a single news
newsController.deleteSingleNews = async (req, res, next) => {
  try {
    // const userId = req.userId;
    // const newsAuthor = await News.findById(req.params.id);
    // if (newsAuthor.author != userId) {
    //   throw new Error("You cannot delete the other user's news");
    // }

    const news = await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: news,
      message: "Delete news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = newsController;
