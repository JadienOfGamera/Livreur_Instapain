const mongoose = require('mongoose');

const BreadSchema = new mongoose.Schema({
  bread_name: {
    type: String,
    required: true
  },
  creator_name: {
    type: String,
    default: ''
  },
  bread_image_link: {
    type: String,
    default: ''
  },
  bread_description: {
    type: String,
    default: '🥖'
  },
  bread_emoji: {
    type: String,
    default: '🥖'
  },
  bread_writter: {
    type: String,
    default: ''
  },
  commande: {
    type: String,
    default: ''
  }
}, { collection: "Bread" });

module.exports = mongoose.model('Bread', BreadSchema);