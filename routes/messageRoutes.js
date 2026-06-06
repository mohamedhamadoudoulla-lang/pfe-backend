const express     = require("express");
const router      = express.Router();
const Message     = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// GET toutes mes conversations (liste unique des contacts)
router.get("/conversations", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate("from", "name email avatar")
      .populate("to", "name email avatar")
      .sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];
    messages.forEach((msg) => {
      const otherId = msg.from._id.toString() === req.user._id.toString()
        ? msg.to._id.toString()
        : msg.from._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const other = msg.from._id.toString() === req.user._id.toString() ? msg.to : msg.from;
        conversations.push({
          _id: msg._id,
          content: msg.content,
          createdAt: msg.createdAt,
          from: msg.from,
          to: msg.to,
        });
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET ma conversation avec quelqu'un
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: req.params.userId },
        { from: req.params.userId, to: req.user._id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST envoyer un message
router.post("/", protect, async (req, res) => {
  try {
    const message = await Message.create({ ...req.body, from: req.user._id });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;