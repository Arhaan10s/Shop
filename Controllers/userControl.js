const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { DATE } = require('sequelize');


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

        await User.update({token},{
            where:{email}
        })

        res.status(200).json({
            userId: user.userId,
            name: user.name,
            usertype: user.usertype,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

exports.logout = async(req,res)=>{
    const {userId} = req.user;
    try{
        
     await User.update({token:null},{where:{userId}})
        res.status(200).json({message:'User logged out successfully!'});

    }
    catch (error) {
        res.status(404).json({message:error.message});
    }
}

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

exports.forget_password = async (req, res)=>{
    const { email, otp:inputOtp, password:inputPassword } = req.body;

    try{
        const user = await User.findOne({
            where:{email}
        })

        console.log(user.disable.getTime());
        console.log(new Date().getTime());
        

        
        

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const curr=new Date().getTime()

        if(user.disable.getTime() > curr){
            return res.status(404).json({message: "User disabled" })
        }
    
        const currentTime = new Date();
        
        if (user.otp_expires && new Date(user.otp_expires) > currentTime && user.otp === null) 
            {
            return res.status(403).json(
                {
                 message: 'Too many attempts. Please try again in 1 minute.' 
                }
            );
        }

        if(inputOtp && !inputPassword){

            if(user.otp === null)
            {
                return res.status(404).json({message: 'Verify the email first before Otp generation'})
            }

            if (user.otp_expires && new Date(user.otp_expires) < currentTime) 
                {
                await User.update({ otp: null, otp_expires: null }, {
                    where: { email }
                });
                return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
            }

            if(user.otp !== (+inputOtp)){
                const attempts = user.otp_attempts || 0 ;

                if(user.otp_attempts > 2)
                {
                     await User.update({otp: null, otp_attempts: 0, otp_expires:null, disable: new Date(currentTime.getTime() + 2 * 60000)},{
                        where:{email}
                    })
                    return res.status(401).json({message: 'Maximum attempts reached try again by verifying the email address'})
                }

                await User.update({otp_attempts : attempts + 1},{
                    where:{email}
                })
                return res.status(400).json({
                    message: 'Invalid OTP',
                    attempts: attempts + 1
                });
            }
            if(user.pin === null )
            {
                const newPin = Math.floor(100000 + Math.random() * 900000);
                await User.update({
                    pin:newPin,
                },{
                    where:{email}
                })
            }

            await User.update({
                    otp_attempts : 0,
                    otp_expires:null,
                },{
                    where:{email}
                }
            )
            return res.status(200).json({
                message: ' Otp verified and please input New password',
            })
        }
        if(inputPassword && inputOtp){
            if (user.otp !== +inputOtp) {
                return res.status(400).json({ message: 'OTP verification required before changing password' });
            }

            const hashedPassword = await bcrypt.hash(inputPassword, 10);


            if(hashedPassword === user.password){
                return res.status(200).json({message:'Password can not be the same'})
            }
            else{
                await User.update({
                    password:hashedPassword,
                    otp:null,
                    otp_attempts:0,
                    otp_expires:null,
                    disable:null
                },{where: {email}})
                
                return res.status(200).json({message:"Password changed successfully!"})

            }
        }
        if(!inputOtp && !inputPassword) 
        {   
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpires = new Date(currentTime.getTime() + 1 * 60000); // 1 min

            await User.update({
                otp,
                otp_attempts:0,
                otp_expires:otpExpires
            },{
                where:{email}
            }) 
            
            res.status(200).json({
                otp,
                message:'OTP sent successfully',
            })
            
        }
   

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}