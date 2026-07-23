const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
require("dotenv").config();
const ejsMate = require("ejs-mate");


// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Image Filter
const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only image files are allowed."));

    }

};

// Upload Middleware
const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});


app.get("/", (req,res) =>{
     res.render("../views/listings/index.ejs")
})

app.get("/home", (req,res) =>{
    res.render("../views/listings/index.ejs")
})

app.get("/listing/sigmaprime", async (req, res)=>{
    res.render("../views/listings/sigmaprime.ejs");
});

app.get("/listing/prime-1", async (req, res)=>{
    res.render("../views/listings/prime1.ejs");
});

app.get("/listing/sigma", async (req, res)=>{
    res.render("../views/listings/sigma10.ejs");
});

app.get("/listing/delta", async (req, res)=>{
    res.render("../views/listings/delta.ejs");
});

app.get("/listing/alpha", async (req, res)=>{
    res.render("../views/listings/alpha.ejs");
});

app.get("/listing/java", async (req, res)=>{
    res.render("../views/listings/java.ejs");
});

app.get("/listing/c", async (req, res)=>{
    res.render("../views/listings/c++.ejs");
});

//Contact Route
app.get("/listing/contact", async (req, res)=>{
    res.render("../views/listings/contact.ejs")
});


//Payment Varification
app.get("/payment-verification", (req, res) => {

    const course = req.query.course || "";

    res.render("listings/payment.ejs", {
        course
    });

});

app.post("/contact", async (req, res) => {

    try {

        const { name, email, mobile, message } = req.body;

        if (!name || !email || !mobile || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "📩 New Contact Message",

            html: `
                <h2>New Contact Message</h2>

                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                        <th>Name</th>
                        <td>${name}</td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>${email}</td>
                    </tr>

                    <tr>
                        <th>Mobile</th>
                        <td>${mobile}</td>
                    </tr>

                    <tr>
                        <th>Message</th>
                        <td>${message}</td>
                    </tr>
                </table>
            `

        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Your message has been sent successfully."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });

    }

});


app.post("/payment-verification", upload.single("photo"), async (req, res) => {

    try {

        const {
            course,
            name,
            email,
            mobile,
            transactionId
        } = req.body;

        if (!course || !name || !email || !mobile || !req.file) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }
        //Changess try kar ry hai......
        // const mailOptions = {
        const adminMail = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: `💳 Payment Verification - ${course}`,

            html: `
                <h2>New Payment Verification Request</h2>

                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">

                    <tr>
                        <th>Course</th>
                        <td>${course}</td>
                    </tr>

                    <tr>
                        <th>Name</th>
                        <td>${name}</td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>${email}</td>
                    </tr>

                    <tr>
                        <th>Mobile</th>
                        <td>${mobile}</td>
                    </tr>

                    <tr>
                        <th>Transaction ID</th>
                        <td>${transactionId || "Not Provided"}</td>
                    </tr>

                </table>
            `,

            attachments: [

                {

                    filename: req.file.originalname,

                    path: req.file.path

                }

            ]

        };

        // await transporter.sendMail(mailOptions);
        await transporter.sendMail(adminMail);

        const userMail = {

    from: process.env.EMAIL_USER,

    to: email,

    subject: "✅ Payment Verification Submitted Successfully",

    html: `

    <div style="max-width:600px;margin:auto;padding:30px;background:#111827;border-radius:12px;font-family:Arial,sans-serif;color:#ffffff;">

        <h2 style="text-align:center;color:#22c55e;">
            ✅ Payment Verification Submitted Successfully
        </h2>

        <p>Hello <b>${name}</b>,</p>

        <p>
            Thank you for submitting your payment verification request.
        </p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0;">

            <tr>
                <td style="padding:10px;border:1px solid #374151;"><b>Course</b></td>
                <td style="padding:10px;border:1px solid #374151;">${course}</td>
            </tr>

        </table>

        <div style="background:#1f2937;padding:20px;border-left:5px solid #22c55e;border-radius:8px;">

            <p style="margin:0;line-height:28px;">

                Thank you! Our team will verify your payment and send your course access to your registered email within <b>2–12 hours</b>.

            </p>

        </div>

        <br>

        <p>
            Please do not submit multiple payment requests.
        </p>

        <hr style="margin:25px 0;border-color:#374151;">

        <p style="text-align:center;font-size:14px;color:#9ca3af;">

            Thank you for choosing <b>Tech Course</b> ❤️

        </p>

    </div>

    `

};

await transporter.sendMail(userMail);

        // Delete uploaded screenshot
        fs.unlink(req.file.path, (err) => {

            if (err) {

                console.log("Delete Error:", err);

            }

        });

        res.json({

            success: true,

            message: "Your payment verification request has been submitted successfully."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Something went wrong."

        });

    }

});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});