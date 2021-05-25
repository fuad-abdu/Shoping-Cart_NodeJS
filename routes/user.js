
var express = require('express');
const session = require('express-session');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
var verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn) {
    next()
  } else {
    res.redirect('/user-login')
  }
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let cartCount = null
  let user = req.session.user
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/home-page',{user, cartCount})
});


router.get('/user-login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/user-login', { 'loginErr': req.session.userLoggedErr })
    req.session.userLoggedErr = false
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  userHelpers.DoSignup(req.body).then((response) => {
    console.log(response);
    
    req.session.user = response
    req.session.userloggedIn = true

    res.redirect('/')
  })
})

router.post('/user-login', (req, res) => {
  userHelpers.DoLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.user = response.user
      req.session.userloggedIn = true

      res.redirect('/')
    } else {
      req.session.userLoggedErr = true
      res.redirect('/tutor-login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user=null
  req.session.userloggedIn=false
  res.redirect('/')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let user = req.session.user
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let total = 0;
  if(products.length>0){
    total = await userHelpers.getTotalAmount(req.session.user._id)
  }
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  console.log(products);
  res.render('user/cart', { user, products, total, cartCount })
})

router.get('/wishlist', verifyLogin, async (req,res)=>{
  let user = req.session.user
  let products = await userHelpers.getWishlistProducts(req.session.user._id)
  console.log(products);
  let cartCount = null  
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/wishlist' ,{user, products, cartCount})
})

router.get('/add-to-cart/:id',verifyLogin,(req, res) => {
  console.log('API connected');
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({status:true})
  })
})

router.get('/add-to-wishlist/:id',(req, res) => {
  userHelpers.addToWishlist(req.params.id, req.session.user._id).then(() => {
    res.json({status:true})
  })
})

router.post('/change-product-quantity',(req, res, next)=>{
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  })
})

router.post('/delete-product', (req,res,next)=>{
  userHelpers.DeleteProduct(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/packed/:id' ,(req,res,next)=>{
  console.log(req.params.id);
  userHelpers.packedStatus(req.params.id).then((response)=>{
    res.json(response)
  })
})

router.get('/shipped/:id' ,(req,res,next)=>{
  console.log(req.params.id);
  userHelpers.shippedStatus(req.params.id).then((response)=>{
    res.json(response)
  })
})

// router.post('/delete-order', (req,res,next)=>{
//   userHelpers.deleteOrder(req.body).then((response)=>{
//     res.json(response)
//   })
// })

router.post('/delete-Wish-product', (req,res,next)=>{
  userHelpers.DeleteWishProduct(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/place-order',verifyLogin,async(req,res)=>{
  let user = req.session.user
  let totalAmount = await userHelpers.getTotalAmount(req.session.user._id)
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/place-order',{totalAmount, user, cartCount})
})

router.post('/place-order',async(req,res)=>{
  let products =await userHelpers.getCartProductList(req.body.userId)
  let totalPrice =await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment']==='COD'){
      res.json({CODsuccess:true})
    }else{
      userHelpers.createRazorpay(orderId,totalPrice).then((response)=>{
        res.json(response)
      })
    }
    
  })
  console.log(req.body);
})

router.get('/order-success',(req,res)=>{
  let user = req.session.user
  res.render('user/order-success',user)
})

router.get('/orders',verifyLogin, async(req,res)=>{

  let user = req.session.user 
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  // let check = await userHelpers.checkStatus(req.session.user._id)
  // console.log(check);
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/orders', {user, orders, cartCount})
})

router.get('/view-order-products/:id',async(req,res)=>{
  let user = req.session.user 
  let products = await userHelpers.getOrderProducts(req.params.id)
  res.render('user/view-order-products', {user, products})
})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(()=>{
    console.log('hlo ', req.body['order[receipt]']);
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status:false,errMsg:''})
  })
})

router.get('/mobiles', async(req,res)=>{
    let products = await productHelpers.addMobileProducts()
    let cartCount = null
  let user = req.session.user
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
      res.render('user/mobiles' , {user,products, cartCount})
})

router.get("/electronics", async (req,res)=>{
  let cartCount = null
  let user = req.session.user
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/electronics',{user,cartCount})
})

router.get('/men-fashion', async (req,res)=>{
  let user = req.session.user 
  let Menproducts = await productHelpers.addMenProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/fashion-men' ,{Menproducts , user, cartCount})
})

router.get('/women-fashion', async (req,res)=>{
  let user = req.session.user 
  let Womenproducts = await productHelpers.addWomenProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/fashion-women' ,{Womenproducts , user, cartCount})
})

router.get('/kids-fashion', async (req,res)=>{
  let user = req.session.user 
  let Kidsproducts = await productHelpers.addKidsProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/fashion-kids' ,{Kidsproducts , user, cartCount})
})

router.get('/foot-wear', async (req,res)=>{
  let user = req.session.user 
  let footproducts = await productHelpers.addFootProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/footwear' ,{footproducts , user, cartCount})
})

router.get('/laptop',async (req,res)=>{
  let user = req.session.user 
  let Laptopproducts = await productHelpers.addLaptopProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/laptop-and-more' ,{Laptopproducts , user, cartCount})
})

router.get('/camera',async (req,res)=>{
  let user = req.session.user 
  let Cameraproducts = await productHelpers.addCameraProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/camera' ,{Cameraproducts , user, cartCount})
})

router.get('/watch',async (req,res)=>{
  let user = req.session.user 
  let Watchproducts = await productHelpers.addWatchProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/watch' ,{Watchproducts , user, cartCount})
})

router.get('/TV',async (req,res)=>{
  let user = req.session.user 
  let TVproducts = await productHelpers.addTVProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/TV' ,{TVproducts , user, cartCount})
})

router.get('/air-conditioner',async (req,res)=>{
  let user = req.session.user 
  let ACproducts = await productHelpers.addACProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/AC' ,{ACproducts , user, cartCount})
})

router.get('/washing-machine',async (req,res)=>{
  let user = req.session.user 
  let WashingMachineproducts = await productHelpers.addWashingMachineProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/washing-machine' ,{WashingMachineproducts , user, cartCount})
})

router.get('/mixer',async (req,res)=>{
  let user = req.session.user 
  let Mixerproducts = await productHelpers.addMixerProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/mixer' ,{Mixerproducts , user, cartCount})
})

router.get('/furniture',async (req,res)=>{
  let user = req.session.user 
  let Furnitureproducts = await productHelpers.addFurnitureProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/furniture' ,{Furnitureproducts , user, cartCount})
})

router.get('/beauty',async (req,res)=>{
  let user = req.session.user 
  let Beautyproducts = await productHelpers.addBeautyProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/beauty' ,{Beautyproducts , user, cartCount})
})

router.get('/Toy',async (req,res)=>{
  let user = req.session.user 
  let Toyproducts = await productHelpers.addToyProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/toy' ,{Toyproducts , user, cartCount})
})

router.get('/home-essential',async (req,res)=>{
  let user = req.session.user 
  let homeEssential = await productHelpers.addHomeProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/home-essential' ,{homeEssential , user, cartCount})
})

router.get('/fitness',async (req,res)=>{
  let user = req.session.user 
  let Fitness = await productHelpers.addFitnessProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/fitness' ,{Fitness , user, cartCount})
})

router.get('/tools',async (req,res)=>{
  let user = req.session.user 
  let Tools = await productHelpers.addToolsProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/tools' ,{Tools , user, cartCount})
})

router.get('/cleaner',async (req,res)=>{
  let user = req.session.user 
  let clean = await productHelpers.addCleanProducts()
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/clean' ,{clean , user, cartCount})
})

router.get('/profile', async (req,res)=>{
  let user = req.session.user
  let cartCount = null
  if (user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  res.render('user/profile',{cartCount, user})
})


module.exports = router;
