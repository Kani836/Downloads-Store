import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  books: [
    {
      bookId: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;