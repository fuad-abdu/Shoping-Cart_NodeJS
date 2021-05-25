var express = require('express');
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helpers')
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

var verifyLogin = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next()
  } else {
    res.redirect('/admin/admin-login')
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  let Admin = req.session.admin
  productHelpers.addAllProducts().then((products)=>{
    res.render('admin/view-products', {admin:true, Admin, products} )
  })
  
});

// router.get('/admin-signup', (req, res) => {
//   res.render('admin/admin-signup',{admin:true})
// })

// router.post('/admin-signup', (req, res) => {
//   adminHelpers.DoSignup(req.body).then((response) => {
//     console.log(response);
    
//     req.session.admin = response
//     req.session.adminloggedIn = true

//     res.redirect('/admin')
//   })
// })

router.post('/admin-login', (req, res) => {
  adminHelpers.DoLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.admin = response.admin
      req.session.adminloggedIn = true

      res.redirect('/admin')
    } else {
      req.session.adminLoggedErr = true
      res.redirect('/admin/admin-login')
    }
  })
})

router.get('/admin-login', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', { 'loginErr': req.session.adminLoggedErr , admin:true})
    req.session.adminLoggedErr = false
  }
})

router.get('/admin-logout', (req, res) => {
  req.session.admin=null
  req.session.adminloggedIn=false
  res.redirect('/admin')
})

router.get('/add-products',verifyLogin, function(req,res){
  let Admin = req.session.admin
  res.render('admin/add-products', {admin:true, Admin})
})

router.post('/add-products',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)

  productHelpers.addProducts(req.body,(id)=>{
    let image = req.files.Image 
    console.log(id);
    image.mv('./public/product-images/'+id+".jpg",(err,done)=>{
      if(err) console.log(err);
      else res.render('admin/add-products', {admin:true})
    })
    
  })
})

router.get('/products',verifyLogin, async (req,res)=>{
  let Admin = req.session.admin
  let products =await productHelpers.addAllProducts()
  res.render('admin/view-all-products',{products,admin:true, Admin})
})

router.get('/delete-product/:id',verifyLogin,(req,res)=>{
  let proId=req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id',verifyLogin, async (req,res)=>{
  let Admin = req.session.admin
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product,admin:true, Admin})
})

router.get('/deliveryDetails/:id', verifyLogin, async (req,res)=>{
  let Admin = req.session.admin
  let Id = req.params.id
  let products = await userHelpers.getOrderProducts(Id)
  let details = await adminHelpers.getAllOrders(Id)
  console.log(details.deliveryDetails);
  console.log(details,'hi');
  res.render('admin/delivery-details', {products, details, Admin, admin:true})
})

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id;
  console.log(req.params.id);
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    
    res.redirect('/admin')
    let image=req.files.Image;
    if(req.files.Image){
      image.mv('./public/product-images/'+id+".jpg")
    }
  })
})

router.get('/all-users', verifyLogin, async (req,res)=>{
  let Admin = req.session.admin 
    let users = await userHelpers.getAllUsers()
    res.render('admin/all-users',{users, admin:true, Admin})
})

router.get('/all-orders', verifyLogin, async (req,res)=>{
  let Admin = req.session.admin 
    let orders = await userHelpers.getAllOrders()
    res.render('admin/all-orders',{orders, admin:true, Admin})
})

module.exports = router;
