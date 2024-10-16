const Transaction = require("../Models/Transaction");
const User = require("../Models/User");
const AccountsService = require("../Services/transactionService");
const { handleTransaction, expireOtp, handleOtpAttempts, resetOtp, generateOtp } = require('../Helper/helper');

exports.transactions = async (req, res) => { 
  let { action, otp: inputOtp, pin, amount, userId } = req.body;

  try {
    // Parse input values
    userId = parseInt(userId, 10);
    amount = parseInt(amount, 10);

    const user = await User.findOne({ where: { userId } });

    if (!user) 
    {
      return res.status(404).json({ message: 'User not found' });
    }

    const accountData = await Transaction.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const currentBalance = accountData ? accountData.balance : 0;
    const account = new AccountsService(currentBalance, userId);

    // Case 1: PIN provided, OTP not provided
    if (pin && !inputOtp) 
      {
        if (user.pin !== +pin) 
        {
          return res.status(400).json({ message: 'Invalid PIN' });
        }

      return await handleTransaction(res, account, action, amount, currentBalance);
    }

    // Case 2: OTP provided, PIN not provided
    if (inputOtp && !pin) 
      {

      const currentTime = new Date();

      if (!user.otp) 
        {
        return res.status(404).json({ message: 'OTP not found' });
        }
      if (user.otp_expires && new Date(user.otp_expires) < currentTime) 
        {
          await expireOtp(userId);
          return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }
      if (user.otp !== +inputOtp) 
        {
          return await handleOtpAttempts(res, user, userId);
        }

      await resetOtp(userId);
      return await handleTransaction(res, account, action, amount, currentBalance);
    }

    // Case 3: Neither OTP nor PIN provided -> Generate OTP
    if (!inputOtp && !pin) 
      {
        const otp = await generateOtp(userId);

        return res.status(200).json({ otp, message: 'OTP sent successfully!' });
      }

    return res.status(400).json({ message: 'Invalid request. Either PIN or OTP is required.' });
  } catch (error) 
  {
    return res.status(500).json({ message: error.message });
  }
};
