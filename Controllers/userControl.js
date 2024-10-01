const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async(req,res)=>{
    try{
        const {userId, name,password,email,usertype} = req.body;
        if (!['admin', 'guest', 'user'].includes(usertype)) {
            return res.status(403).json({ message: 'Invalid UserType' });
        }
  
        const userExists = await User.findOne({where : {email}});
        if(userExists)
        {
            return res.status(400).json('Email is already associated with an account')
        }

        const hashedPassword=await bcrypt.hash(password,10)


        const user  = await User.create({
            userId,
            name,
            email,
            usertype,
            password:hashedPassword
        })
        if(user)
        {
            res.status(201).json({
                message:'User created successfully',
                data : user
            })
        }
        else{
            res.status(400).json({
                message:'Unable to create user'
            })
        }
    }catch(err)
    {
        res.status(500).json({message:err.message})
    }
}


exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = await jwt.sign(
            { 
                userId: user.userId, 
                usertype: user.usertype 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            userId: user.userId,
            name: user.name,
            usertype: user.usertype,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getUser = async (req,res)=>{
    const{ userId } = req.body;
    
    try{
        const users = await User.findAll({
            where:{userId},
        })
        
        
        res.status(200).json(users);
    }
    catch(error)
    {   
        res.status(500).json({error: error.message});
    }
}

exports.deleteUser = async (req, res) => {
    const { userId} = req.body;

  try {
    const deleted = await User.destroy({
      where: { userId},
    });

    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.permissions =  async (req,res)=>{
    const {userId,usertype} = req.body;

    try{
        if(usertype){

            const existUser = await User.findOne({
                where:{userId}
            })
            if(!existUser){
                return res.status(404).send({message: 'User not found'})
            }

            const [updated] = await User.update(req.body,{
                where: {userId}
            })
            if(updated)
                {
                    const updatedUsertype = await User.findOne({
                        where: {userId}
                    })
                    res.status(200).json(updatedUsertype)
                }
        }
    }
    catch (error) {
        res.status(500).json({message: err.message})
    }
}