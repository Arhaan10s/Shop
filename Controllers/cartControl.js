const Cart  = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/User');

exports.addCart = async (req, res) => {
    const { productId, userId } = req.body;

    try {
        const product = await Product.findByPk(productId);
        const user = await User.findByPk(userId);

        if (!product || !user) {
            return res.status(404).json({
                success: false,
                message: 'User or Product not found'
            });
        }

        // Check if the product is already in the user's cart
        let cartItem = await Cart.findOne({ where: { userId, productId } });

        if (cartItem) {
            // If the product is already in the cart, increase the count by 1
            cartItem.count += 1;
            await cartItem.save();
        } else {
            // Add the product to the cart with an initial count of 1
            await Cart.create({ userId, productId, user, count: 1 });
        }

        res.status(200).json({
            success: true,
            message: 'Product added to Cart successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.viewCart = async (req, res) => {
    const { userId } = req.body;

    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Product,
                    attributes: ['name', 'price']
                }
            ],
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items in the cart' });
        }

        // Calculate total quantity of all items in the cart
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.count, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + item.Product.price, 0);

        // Group products by user
        const userCart = {
            userId: userId,
            userName: cartItems[0].User.name,
            products: cartItems.map(item => ({
                productId: item.productId,
                name: item.Product.name,
                price: item.Product.price,
                quantity: item.count // Assuming `quantity` is defined in the Cart model
            })),
            totalItems : totalQuantity,
            totalAmount : totalPrice || 0, 
        };

        res.status(200).json(userCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.removeCart = async (req,res)=>{
    const {userId, productId} = req.body;
    try{
        const user = await Cart.findAll({
            where:{userId},
        })
        if(!user)
        {
            res.status(500).json({message: 'User not found'})
        }
        const product = await Cart.findAll({
            where:{productId}
        })
        if(!product)
        {
            res.status(500).json({message:'Product not found'})
        }
        const del = await Cart.destroy({
            where:{productId},
            include:{
                model:User,
            }
        })
        res.status(200).json({
            message:'Message succesfully removed from the cart',
            data:del
        })
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
}