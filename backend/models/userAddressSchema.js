const userAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  addresses: [addressSchema]
});

module.exports = mongoose.model('UserAddress', userAddressSchema);