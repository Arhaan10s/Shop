const Product = require('../Models/Product');
const Owner  = require('../Models/Owner')
const jwt = require('jsonwebtoken');
const User = require('../Models/User')

exports.createProduct = async(req,res)=>{
    try{
       
        const { userId, ownerId, usertype } = req.user; // Extract information from the token
        console.log(ownerId,userId,usertype);
        if (ownerId)
        {
            const owner = await Owner.findByPk(ownerId);
            if (!owner) 
                {
                return res.status(404).json({ message: 'Owner not found' });
            }

        } 
        else if (userId) 
        {
            // If the token belongs to a user, check if the user is an admin or user
            const user = await User.findByPk(userId);
            if (!user || !['admin','user'].includes(usertype)) 
                {
                return res.status(403).json(
                    { 
                    message: 'Access denied. Only admin and user can create products not guests.' 
                    }
                );
            }
        } 
        else 
        {
            return res.status(403).json({ message: 'Access denied. Invalid user or owner information.' });
        }

        const {productId,name,price,} = req.body;
        const image = req.file ? req.file.filename : null;

        const product = await Product.create({
            ownerId,
            productId,
            name,
            price,
            image
        })
        if(product)
        {
            res.status(200).json({
                status: true,
                message: 'Product created successfully',
                data: product
            })
        }
        else{
            res.status(404).json({
                status:false,
                message: 'Product cannot be created',
            })
        }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.getProduct = async(req,res)=>{
    const {userId,productId} = req.body;
    
    try{

        const product = await Product.findAll({
            where: {productId},
            
        })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.deleteProduct = async(req,res)=>{
    const {productId} = req.body;

    const {ownerId} = req.user;
    if (ownerId)
        {
            const owner = await Owner.findByPk(ownerId);
            if (!owner) 
                {
                return res.status(404).json({ message: 'Owner not found' });
            }

        } 
    else
    {
        return res.status(400).json({message:"Only Owner can delete the product"})
    }   

    try{
        const deleted  =  await Product.destroy({
            where:{productId}
        })
        if(deleted){
            res.status(200).json({message: 'Product deleted successfully'});
        }
        else{
            res.status(404).json({message: 'Product not found'});
        }
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.updateProduct = async(req,res)=>{

    const {productId,...updatedData} = req.body;

    try{
        const newImage=req.file?req.file.filename:null;
        updatedData.image = newImage;
        const [ updated ] = await Product.update(updatedData,{
            where: {productId}
        })
        if(updated)
        {
            const updatedProduct = await Product.findOne({
                where: {productId}
            })
            res.status(200).json(updatedProduct)
        } else {
            res.status(404).json({ message: "Product not found" });
          }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}