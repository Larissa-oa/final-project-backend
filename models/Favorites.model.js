const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType', // 
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Plant', 'Mushroom', 'Forum'],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const FavoritesModel = mongoose.model('Favorite', favoritesSchema);

module.exports = FavoritesModel;
