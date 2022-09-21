const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const bp = require('body-parser');
const port = process.env.PORT || 3000;
const razorpay = new Razorpay({
    key_id: 'rzp_test_CMVdihSLEuPHnl',
    key_secret: 'eOwPULk2Y5GgEU075GTRH3ZV',
})

//static files
app.use(express.static("public"));
//template engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
//body parser
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//endpoints
app.get("/", (req, res) => {
    res.render("index");
})

app.post("/order", (req, res) => {
    let options = {
        amount: 50000, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    razorpay.orders.create(options, (err, order) => {
        //   console.log(order);
        res.json(order);
    })

})

app.post("/order-completed", (req, res) => {
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocumnet) => {
        // console.log(paymentDocumnet);
        if (paymentDocumnet.status == 'captured') {
            res.render("success");
        }
    })
})


app.listen(8000, function() {
    console.log("server started http://localhost:8000/ ");
});