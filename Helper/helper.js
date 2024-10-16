const User = require('../Models/User')

// Helper function to handle deposit/withdraw transactions
async function handleTransaction(res, account, action, amount, currentBalance) {
  switch (action) {
    case 'deposit':
      await account.deposite(amount);
      return res.status(200).json({ balance: account.getBalance() });
      
    case 'withdraw':
        if (currentBalance < amount) 
        {
          return res.status(400).json({ message: 'Insufficient balance' });
        }
      await account.withdrawl(amount);
      return res.status(200).json({ balance: account.getBalance() });

    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
}

// Helper function to expire OTP
async function expireOtp(userId) {

  await User.update({
     otp: null, 
     otp_expires: null, 
     otp_attempts: 0 
    }, { 
        where: { userId } 
    });
}

// Helper function to handle OTP attempts
async function handleOtpAttempts(res, user, userId) {
    
  const attempts = user.otp_attempts || 0;

  if (attempts >= 2) 
    {
    await User.update(
      { 
        otp: null, 
        otp_attempts: 0, 
        otp_expires: null, 
        disable: new Date(Date.now() + 2 * 60000) 
    },
      { 
        where: { userId } 
    }
    );
    return res.status(401).json({ message: 'Maximum OTP attempts reached. Try again later.' });
  }

  await User.update(
    { 
        otp_attempts: attempts + 1 
    }, {
         where: { userId } 
        });

  return res.status(400).json({ message: 'Invalid OTP', attempts: attempts + 1 });
}

// Helper function to reset OTP after success
async function resetOtp(userId) {

  await User.update({ 
    otp_attempts: 0, 
    otp: null, 
    otp_expires: null 
}, { 
    where: { userId } 
});
}

// Helper function to generate OTP
async function generateOtp(userId) {

  const otp = Math.floor(100000 + Math.random() * 900000);

  const otpExpires = new Date(Date.now() + 1 * 60000); // 1 min expiry

  await User.update(
    { 
        otp, 
        otp_attempts: 0, 
        otp_expires: otpExpires 
    },
    { 
        where: { userId } 
    }
  );
  return otp;
}

module.exports = { handleTransaction, expireOtp, handleOtpAttempts, resetOtp, generateOtp };
