const Transaction = require("../Models/Transaction");


class AccountsService{
    constructor(balance=0,userId){
        this.balance = balance;
        this.userId = userId;
       
    }
    async deposite(amount){
        this.balance+=amount;
        await Transaction.create({
            action:'deposit',
            amount: amount,
            transaction_date: new Date(),
            balance: this.balance,
            userId: this.userId
        })
        return this

    }

     async withdrawl(amount){
        this.balance-=amount;
        await Transaction.create({
            action:'withdraw',
            amount: amount,
            transaction_date: new Date(),
            balance: this.balance,
            userId: this.userId
        })
        return this
    }

     getBalance(){
     return `your balance is :${this.balance}`
    }
}

module.exports = AccountsService;