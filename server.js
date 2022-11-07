const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const {userModal, inventory_Modal, orderModel,product_Modal} = require("./userSchema");


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));




app.set("view engine","ejs");
app.listen(3000,(err)=>{
    if(!err){
        console.log("Server Started at port 3000");
    }
    else{
        console.log(err);
    }
});

mongoose.connect("mongodb+srv://Navyaa:Navya29@cluster0.vv8toxm.mongodb.net/?retryWrites=true&w=majority",()=>{   
    console.log("Successfully connected to db")
},(err)=>{
    console.log(err)
})

app.get("/", (req, res, next) => {
    res.send("hi")
})
app.post("/user/add",(req,res)=>{
    userModal.find({email:req.body.email}).then((userData)=>{
        if(userData.length){
            res.status(400).send("User already Exists");
        }
        else{
            userModal.create({name: req.body.name, email: req.body.email,customer_id : Math.floor((Math.random() * 10) + 1)}).then((userData)=>{
                res.status(200).send({userData});
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
});


app.post("/product",(req,res)=>{
    product_Modal.create({product_id: req.body.product_id,product_type: req.body.product_type,product_name: req.body.product_name,available_quantity: req.body.available_quantity}).then((ProductData)=>{
        res.status(200).send({ProductData});
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/order",async(req,res)=>{
    
    const item =    await product_Modal.find({product_id: req.body.product_id});
    if(item.length){
        if( item[0].available_quantity >= req.body.quantity){
            const resultquantity = item[0].available_quantity - req.body.quantity;
            const orderData = await  orderModel.create({customer_id: req.body.customer_id,product_id: req.body.product_id,product_name: req.body.product_name,quantity: req.body.quantity});
            res.status(200).send(orderData);
            const productupdate = await product_Modal.updateOne({product_id: req.body.product_id},{available_quantity: resultquantity});
            console.log(productupdate);
        }else{
            res.status(400).send("ITEM IS OUT OF STOCK");
        }
    }
});
app.post("/user",async(req,res)=>{
    
    const item =    await userModal.find({customer_id: req.body.customer_id});
    if(item.length){
        if( item[0].balance >= req.body.balance){
            const result = item[0].balance - req.body.balance;
            const productData = await  userModal.create({customer_id: req.body.customer_id,name: req.body.name,email:req.body.email,balance: req.body.balance});
            res.status(200).send(productData);
            const customerupdate = await userModal.updateOne({product_id: req.body.product_id},{balance: result});
            console.log(customerupdate);
        }else{
            res.status(400).send("INSUFFICIENT FUNDS");
        }
    }
});




app.get("/user/add",(req,res)=>{
    userModal.find().then((user)=>{
        res.render("user",{user});
    })
});

app.get("/product",(req,res)=>{
    product_Modal.find().then((product)=>{
        res.render("product",{product});
    })
});



app.get("/order",(req,res)=>{
    orderModel.find().then((orders)=>{
        res.render("orders",{orders});
    })
});


app.put("/productName/availableQuantity",(req,res)=>{
    product_Modal.updateOne({product_name: req.body.product_name},{available_quantity: req.body.available_quantity}).then((data)=>{
        res.send("Product Quantity updated successfully")
    })
})

app.put("/email/costOfAnOrder",(req,res)=>{
    userModal.updateOne({customer_name: req.body.customer_name},{balance: req.body.balance}).then((data)=>{
        res.send("Balance updated successfully")
    })
})


app.use((req, res, next) => {
    if (res.status(400)) {
        res.send("Not Found")
    }
});