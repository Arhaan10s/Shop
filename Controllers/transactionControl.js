const Transaction = require("../Models/Transaction");
const AccountsService = require("../Services/transactionService");

exports.depositeService=async(req,res)=>{
   let {userId,amount}=req.body
 
  try{
    userId=parseInt(userId,10)
    amount=parseInt(amount,10)

    const accountData = await Transaction.findOne({
        where: {userId},
        order: [['createdAt', 'DESC']],
    })
    
    console.log(accountData);

    const currentBalance = accountData ? accountData.balance : 0;
    const account = new AccountsService(currentBalance, userId);

    await account.deposite(amount)
    res.status(200).json({balance:account.getBalance()})
  }catch(err){
    console.log(err);
    
  }
}

exports.withdrawService=async(req,res)=>{
    let{ userId,amount }=req.body;

    try{
        userId = parseFloat(userId);
        amount = parseFloat(amount);

        const accountData = await Transaction.findOne({
            where: {userId},
            order: [['createdAt', 'DESC']],
        })
        console.log(accountData);
        

        const currentBalance = accountData ? accountData.balance : 0;
        const account  = new AccountsService(currentBalance, userId);
        await account.withdrawl(amount)
        res.status(200).json({balance:account.getBalance()})
    }
    catch(err){
        console.log(err);
    }

}