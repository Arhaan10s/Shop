const Owner = require('../Models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../Models/Product');


exports.registerOwner = async(req,res)=>{
    try{
        const {ownerId, name,password,email} = req.body;

        const ownerExists = await Owner.findOne({where : {email}});
        if(ownerExists)
        {
            return res.status(400).json('Email is already associated with an account')
        }

        const hashedPassword=await bcrypt.hash(password,10)
      

        const owner  = await Owner.create({
            ownerId,
            name,
            email,
            password:hashedPassword
        })
        if(owner)
        {
            res.status(201).json({
                message:'owner created successfully',
                data : owner
            })
        }
        else{
            res.status(400).json({
                message:'Unable to create owner'
            })
        }
    }catch(err)
    {
        res.status(500).json({message:err.message})
    }
}

exports.signInOwner = async (req,res)=>{
    const {email,password} = req.body
  try{
    const owner=await Owner.findOne({
        where: {email}
    })
    if(!owner)
    {
        res.status(404).json('owner not found')
    }

    const isMatch = await bcrypt.compare(password, owner.password)
    if(!isMatch)
    {
        return res.status(404).json('Invalid password')
    }

    const ownerDetails=owner.toJSON()
   

    const token=await jwt.sign({ownerId:ownerDetails.ownerId},process.env.JWT_SECRET, {expiresIn :'1h'})

     res.status(200).json(
        {
            ownerId:ownerDetails.ownerId,
            name:ownerDetails.name,
            password:ownerDetails.password,
            token,
        }
     )


  }catch(err){
    console.log(err.message);
    
  }
}


exports.getOwner = async (req, res) => {
    const { ownerId } = req.body;

    try {
        const owner = await Owner.findOne({
            where: { ownerId }, // Use ownerId here
            include: [
                {
                    model: Product,
                    as: 'Products', // Use the alias defined in the association
                    attributes: ['name', 'price'],
                },
            ],
        });

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteOwner = async (req, res) => {
    const { ownerId} = req.body;

  try {
    const deleted = await Owner.destroy({
      where: { ownerId},
    });

    if (deleted) {
      res.status(200).json({ message: "owner deleted successfully" });
    } else {
      res.status(404).json({ message: "owner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};