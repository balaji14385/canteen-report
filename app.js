const { prototype } = require("events");
var express = require("express");
const fs = require("fs");
var xs=require('xlsx')
var f=fs.readFileSync('./index.html','utf-8')
var abc=fs.readFileSync('./content.html','utf-8')
var demo = fs.readFileSync('./demo.html', 'utf-8');
var fm = fs.readFileSync('./form.html', 'utf-8');
var db=require('./database.js');
const { trusted } = require("mongoose");
var app=express();
app.use(express.json())
var dt=new Date()
app.use(express.urlencoded({extended:true}))
var ar=['Bapatla','Chilakaluripet Clock Tower Center',
  'Chilakaluripet NRT Center',
  'Chilakaluripet Veterinary Hospital',
  'Gudivada Mahathma Gandhi Municipal Shopping Complex',
  'Gudivada Tummala RamaBrahmam Park Premises',
  'Guntur 84- Agriculture Office',
  'Guntur 85- ID Hospital Amaravathi Road',
  'Guntur 86- Infront Of DTC Office Premises',
  'Guntur 87- Mirchi Yard',
  'Guntur 88- Nalla Cheruvu Road Near Water Tanks',
  'Guntur 89- Pallanadu Bus Stand',
  'Guntur 91- Raitu Bazar Near RTC Bus Stand',
  'Jaggaiahpet',
  'Macherla',
  'Machilipatnam',
  'MTMC Near RTC Old Bus stand',
  'MTMC Nulakapeta',
  'MTMC Undavalli',
  'MTMC Ap Secretariat',
  'MTMC Ap High Court',
  'Nandigama',
  'Narasaraopet At Vegetable Market',
  'Narasaraopet Palnadu Bus Stand',
  'Narasaraopet KSR Stadium',
  'Nuzivid',
  'Pedana',
  'Piduguralla',
  'Ponnur',
  'Repalle',
  'Sattenapalle',
  'Tenali Market Yard',
  'Tenali Near RTC Complex',
  'Tenali Near Vegetable Market, Opp Municipal Office',
  'Tiruvuru',
  'Vijayawada APSRM School',
  'Vijayawada Ayodhya Nagar',
  'Vijayawada Bavaji Pet (Gulabi Thota)',
  'Vijayawada Dharna Chowk',
  'Vijayawada Gandhi Mahila Kalasala',
  'Vijayawada Housing Board Colony',
  'Vijayawada Padamata High School',
  'Vijayawada Ranigari Thota',
  'Vijayawada RTC Work Shop',
  'Vijayawada Sai Baba Temple',
  'Vijayawada Singh Nagar',
  'Vuyyuru'
]
app.get('/',(req,res)=>{
    res.send(f)
})
app.get('/home',(req,res)=>{
  res.send(f)
})
app.post('/register',async(req,res)=>{
  var ass
  var qrt=[]
  var ry
  try{
    var {SheetDate,CanteenName,Breakfast,Lunch,Dinner}=req.body
    var NoOfTokens = Number(Breakfast) + Number(Lunch) + Number(Dinner);
    var TotalAmount=NoOfTokens*5;
    var d=await db.find({SheetDate,CanteenName})
    console.log(d)
    if(d.length==0)
    {
  var rrr=ar.map((e)=>{
  var ob={
    SheetDate,
    CanteenName:e,
    Breakfast:0,
    Lunch:0,
    Dinner:0,
    NoOfTokens:0,
    TotalAmount:0
  }
  return ob
})
await db.insertMany(rrr)
}
    ass= await db.findOneAndUpdate({SheetDate,CanteenName},{$set:{
      SheetDate,
      CanteenName,
      Breakfast,
      Lunch,
      Dinner,
      NoOfTokens,
      TotalAmount
    }}, { new: true}
    
)
qrt.push(ass)
const allData = await db.find().sort({ SheetDate: 1, CanteenName: 1 });
    const excelData = allData.map(e => ({
      SheetDate: e.SheetDate,
      CanteenName: e.CanteenName,
      Breakfast: e.Breakfast,
      Lunch: e.Lunch,
      Dinner: e.Dinner,
      NoOfTokens: e.NoOfTokens,
      TotalAmount: e.TotalAmount
    }));
    const ws = xs.utils.json_to_sheet(excelData);
    const wb = xs.utils.book_new();
    xs.utils.book_append_sheet(wb, ws, "CanteenData");
    xs.writeFile(wb, "./canteen_data.xlsx");

var arr = qrt.map((e) => {
   return demo
    .replace("{{%sd%}}", e.SheetDate || '0')
    .replace("{{%CanteenName%}}", e.CanteenName || '0')
    .replace("{{%b%}}", e.Breakfast || '0')
    .replace("{{%l%}}", e.Lunch || '0')
    .replace("{{%dd%}}", e.Dinner || '0')
    .replace("{{%nt%}}", e.NoOfTokens || '0')
    .replace("{{%ta%}}", e.TotalAmount || '0');
});
let fn=arr.join(" ")
res.send(abc.replace('{{%data%}}',fn))
  }
  catch(err)
  {
    res.send("internal server error")
  }

})
app.get('/data',async(req,res)=>{
  var ddd
  try{
 ddd=await db.find().sort({SheetDate:1,CanteenName:1})
 }
 catch(err)
 {
  res.send(err)
 }
  var arr = ddd.map((e) => {
   return demo
    .replace("{{%sd%}}", e.SheetDate || '0')
    .replace("{{%CanteenName%}}", e.CanteenName || '0')
    .replace("{{%b%}}", e.Breakfast || '0')
    .replace("{{%l%}}", e.Lunch || '0')
    .replace("{{%dd%}}", e.Dinner || '0')
    .replace("{{%nt%}}", e.NoOfTokens || '0')
    .replace("{{%ta%}}", e.TotalAmount || '0');
});
let fn=arr.join(" ")
   res.send(abc.replace('{{%data%}}',fn))
 
})
app.get('/form',(req,res)=>{
  res.send(fm)
})
app.post('/operation',async(req,res)=>{
  console.log(req.body)
  var {FromDate,ToDate,CanteenName}=req.body
  if(!ToDate)
  {
    ToDate='null'
  }
  var dtt
  try{
   dtt=await db.find({SheetDate:{$gte:FromDate,$lte:ToDate},CanteenName:CanteenName}).sort({SheetDate:1,CanteenName:1})
  }
  catch(err)
  {
  res.send(err)
  }
  var arr = dtt.map((e) => {
   return demo
    .replace("{{%sd%}}", e.SheetDate || '0')
    .replace("{{%CanteenName%}}", e.CanteenName || '0')
    .replace("{{%b%}}", e.Breakfast || '0')
    .replace("{{%l%}}", e.Lunch || '0')
    .replace("{{%dd%}}", e.Dinner || '0')
    .replace("{{%nt%}}", e.NoOfTokens || '0')
    .replace("{{%ta%}}", e.TotalAmount || '0');
});
let fn=arr.join(" ")
   res.send(abc.replace('{{%data%}}',fn))
})
const port = process.env.PORT || 4040
app.listen(port, () => {
  console.log("server started");
});
