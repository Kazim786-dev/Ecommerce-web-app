import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image:{
    type: String,
    required:true
  },
  color:{
    type:String,
    required:true
  },
  size:{
    type:String,
    enum:['XS','S','M','L','XL','XXL'],
    required:true
  }
},{
  timestamps:true
});

const Product = model('Product', productSchema);

export default Product;
