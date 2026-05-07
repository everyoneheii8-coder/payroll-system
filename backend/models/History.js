const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({

  type: {
    type: String
  },

  fileName: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

const History = mongoose.model(
  'History',
  historySchema
)

module.exports = History