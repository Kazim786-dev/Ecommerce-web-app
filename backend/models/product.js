import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    // required: true,
    // unique:true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity:{
    type: Number,
    required: true
  },
  isDeleted: {
    type:Boolean,
    default:false
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    // required: true
  },
  image:{
    type: String,
    required:true
  },
  color:{
    type:String,
    required:true,
    default:'Black'
  },
  size:{
    type:String,
    enum:['XS','S','M','L','XL','XXL','All'],
    // required:true,
    default:'L'
  }
},{
  timestamps:true
});

const Product = model('Product', productSchema);

export default Product;
