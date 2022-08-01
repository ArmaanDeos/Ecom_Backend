const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongo = process.env.MONGO_URL 
const userRouter = require('./Routes/user');
const authRouter = require('./Routes/auth');
const productRouter = require('./Routes/product');
const cartRouter = require('./Routes/cart');
const orderRouter = require('./Routes/order');

app.use(express.json());

//Default Configurations 
app.get('/',(req,res)=> {
    res.send('Default Express Server Started')
})

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);



app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

//Making Db Connection
mongoose.connect(mongo)
// Promise 
.then (()=> console.log('DBConnection Successfully Established'))
.catch((err) =>{
    console.log(err);
});
