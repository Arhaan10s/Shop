const Transaction = require("../Models/Transaction");
const User = require("../Models/User");
const AccountsService = require("../Services/transactionService");


exports.transactions = async (req, res) => { 
  let { action, otp: inputOtp, pin, amount, userId } = req.body;

  try {
      const user = await User.findOne({ where: { userId } });
      const currentTime = new Date();
      userId = parseInt(userId, 10);
      amount = parseInt(amount, 10);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const accountData = await Transaction.findOne({
          where: { userId },
          order: [['createdAt', 'DESC']],
      });

      const currentBalance = accountData ? accountData.balance : 0;
      const account = new AccountsService(currentBalance, userId);

      // Case 1: PIN provided, OTP not provided -> Process deposit/withdrawal
      if (user.pin === +pin && !inputOtp) {

          // Handle deposit or withdrawal based on action
          switch (action) {
              case 'deposit':
                  await account.deposite(amount);
                  break;
              case 'withdraw':
                  if (currentBalance < amount) {
                      return res.status(400).json({ message: 'Insufficient balance' });
                  }
                  await account.withdrawl(amount);
                  break;
              default:
                  return res.status(400).json({ message: 'Invalid action' });
          }

          return res.status(200).json({ balance: account.getBalance() });
      }

      // Case 2: OTP provided, PIN not provided -> Verify OTP -> Do Transaction
      if (inputOtp && !pin) {
          if (!user.otp) {
              return res.status(404).json({ message: 'OTP not found. Please generate it first.' });
          }

          if (user.otp_expires && new Date(user.otp_expires) < currentTime) {
              await User.update({ otp: null, otp_expires: null, otp_attempts: 0 }, { where: { userId } });
              return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
          }

          if (user.otp !== +inputOtp) {
              const attempts = user.otp_attempts || 0;

              if (attempts >= 2) {
                  await User.update(
                      {
                          otp: null,
                          otp_attempts: 0,
                          otp_expires: null,
                          disable: new Date(currentTime.getTime() + 2 * 60000), // Block for 2 mins
                      },
                      { where: { userId } }
                  );
                  return res.status(401).json({ message: 'Maximum OTP attempts reached. Try again later.' });
              }

              await User.update({ otp_attempts: attempts + 1 }, { where: { userId } });
              return res.status(400).json({ message: 'Invalid OTP', attempts: attempts + 1 });
          }

          // OTP verified successfully
          await User.update({ otp_attempts: 0, otp: null, otp_expires: null }, { where: { userId } });

          if(!action && ! amount)
          {
            return res.status(403).json({ message:"please input amount and action"})
          }


          switch (action) {
            case 'deposit':
                await account.deposite(amount);
                break;
            case 'withdraw':
                if (currentBalance < amount) {
                    return res.status(400).json({ message: 'Insufficient balance' });
                }
                await account.withdrawl(amount);
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        return res.status(200).json({ balance: account.getBalance() });

      }

      // Case 3: Neither OTP nor PIN provided -> Generate OTP
      if (!inputOtp && !pin) {
          const otp = Math.floor(100000 + Math.random() * 900000);
          const otpExpires = new Date(currentTime.getTime() + 1 * 60000); // 1 min expiry

          await User.update(
              {
                  otp,
                  otp_attempts: 0,
                  otp_expires: otpExpires,
              },
              { where: { userId } }
          );

          return res.status(200).json({ otp, message: 'OTP sent successfully!' });
      }

      return res.status(400).json({ message: 'Invalid request. Either PIN or OTP is required.' });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};
