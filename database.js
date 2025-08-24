const mongoose = require('mongoose');
const con="mongodb+srv://balaji:harekrishna666$$$@project.caa1tsj.mongodb.net/sweet?retryWrites=true&w=majority&appName=project"
mongoose.connect(con1)
const userSchema = new mongoose.Schema({
  SheetDate:{
    type:String,
    trim:true
  },
  CanteenName:{
    type:String,
    trim:true
  },
  Breakfast:{
    type:Number,
    default:0
  },
  Lunch:{
    type:Number,
    default:0
  },
  Dinner:{
    type:Number,
    default:0
  },
  NoOfTokens:{
    type:Number,
    default:0
  },
  TotalAmount:{
    type:Number,
    default:0
  }
});

module.exports = mongoose.model('canteen', userSchema);
