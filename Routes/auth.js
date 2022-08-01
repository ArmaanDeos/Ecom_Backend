const router = require("express").Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

// RESISTER USERS

router.post('/register', async (req,res) => {

    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    });
    // Save the data in database.
try{
    const savedUser = await newUser.save();
   res.status(201).json(savedUser);

} catch(err){
    res.status(500).json(err);
}
});


// LOGIN

router.post('/login', async (req,res) => {
    
    try{
        const user = await User.findOne({username:req.body.username});

        // Condition

        !user && res.status(401).json("Wrong Username or Password");

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);

        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        //condition
        OriginalPassword !== req.body.password &&  res.status(401).json("Wrong Username or Password");

        
         // JsonWebToken for verification
         const accessToken =jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
         }, process.env.JWT_SEC,{expiresIn:"10d"}
         );


         // Hide password from mongodb
         const { password, ...other} = user._doc;



        // If everything is good so return this
        res.status(200).json({...other, accessToken});

       




}catch(err){
    res.status(500).json(err);
}
});



        

module.exports = router;