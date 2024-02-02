const mongoose = require('mongoose');
const { Schema } = mongoose;

const providerSchema = new Schema({
    address: { type: String, required: true },
    phone: {type: String, required: true},
    name: {type: String, required: true}
}, {
  timestamps: true
});

const Provider = mongoose.model('providers', providerSchema);

module.exports = Provider;