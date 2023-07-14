import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  }
  // You can add more fields like shipping address, payment details, etc. as per your requirements
});

const Order = model('Order', orderSchema);

export default Order;
