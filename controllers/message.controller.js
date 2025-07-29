import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../SocketIO/server.js"; // ✅ important

export const sendMessage = async (req, res) => {
  try {
    console.log("🔥 [sendMessage] Controller Hit");

    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user?._id;

    console.log("📩 Message:", message);
    console.log("👤 Sender:", senderId);
    console.log("👤 Receiver:", receiverId);

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender or Receiver ID missing." });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    // Create new conversation if not found
    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId]
      });
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    // Add message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Send message in real-time if receiver is online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log("📡 Sending real-time message to receiver socket:", receiverSocketId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({ message: "Message sent", newMessage });

  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] }
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    return res.status(200).json(messages);

  } catch (error) {
    console.error("❌ Error in getMessages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
