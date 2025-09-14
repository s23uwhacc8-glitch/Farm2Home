const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
  qty: {type:Number, required:true},
  status: {type:String, enum:['Pending','Confirmed','Dispatched','Delivered','Cancelled'], default:'Pending'},
  deliveryAgent: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{timestamps:true});
module.exports = mongoose.model('Order', orderSchema);
