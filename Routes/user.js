
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();


// UPDATE 
    router.put('/:id', verifyTokenAndAuthorization, async (req,res) => {
        // before updating  i m going to check password so user can change password so in this case we again encrypt our password

        if(req.body.password){
            req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        }

        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
            },{new:true});

            res.status(200).json(updatedUser);

        }catch(err){
            res.status(500).json(err);
        }

    })

    //DELETE 
     router.delete('/:id', verifyTokenAndAuthorization, async (req,res)=> {
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted successfully");
        }catch(err){
            res.status(500).json(err);
        }
     })



    //GET USER  
     router.get('/find/:id', verifyTokenAndAdmin, async (req,res)=> {
        try{
           const user = await User.findById(req.params.id);
           const {password, ...other} = user._doc;
            res.status(200).json(other);
        }catch(err){
            res.status(500).json(err);
        }
     })


      //GET ALL USER  
      router.get('/', verifyTokenAndAdmin, async (req,res)=> {

        // if we want to sort latest 5 users we pass query
        const query = req.query.new

        try{
           const users = query ? await User.find().sort({_id:-1}).limit(1) : await User.find();
           
            res.status(200).json(users);
        }catch(err){
            res.status(500).json(err);
        }
     })

     // GET USER STATS
     router.get('/stats', verifyTokenAndAdmin, async (req,res)=> {
        // Limit data base 
        const data = new Date();
        const lastYear = new Date(data.setFullYear(data.getFullYear() -1 )) // return last-year today.

        try {
            
            const data = await User.aggregate([
                {$match:{createdAt: {$gt:lastYear}}},

                {
                    $project:{
                        month:{$month:"$createdAt"},
                    },
                },
                {
                    $group:{
                        _id:"$month",
                        total:{$sum:1 },
                    }
                }
            ]);
            res.status(200).json(data)


        }catch(err){
            res.status(500).json(err);
        }
     })


module.exports = router