const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {type:String, required:true},
  price: {type:Number, required:true},
  qty: {type:Number, default:0},
  farmer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
  description: {type:String},
  imageUrl: {type:String},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
},
  {timestamps:true}
);
module.exports = mongoose.model('Product', productSchema);
