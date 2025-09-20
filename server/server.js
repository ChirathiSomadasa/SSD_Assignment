// server.js
require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportStrategy = require("./passport");
const cookieSession = require("cookie-session");
const { body, validationResult } = require('express-validator');


// Routes
const userRoute = require("./routes/user_route");
const predictionRoute = require("./routes/prediction_route");
const diseaseLocationRoutes = require("./routes/map/diseaseLocation");
const locationNotificationRoutes = require("./routes/map/notification");
const notificationRoute = require("./routes/map/notification_route");

// Models
const ContactModel = require('./models/contact');

const app = express();

const session = require("express-session");

app.use(
    session({
        secret: "cyberwolve", 
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// JWT Authentication Middleware
app.use((req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        req.current_user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET || "210edd3338fdba8c2c0ea2247cea7ae343f3f110779a829c51412c3a7e3e5e1a", (err, user) => {
        if (err) {
            console.warn("JWT Verification Failed:", err.message);
            req.current_user = null;
        } else {
            req.current_user = {
                user_id: user.userId,
                user: { email: user.email, user_type: user.userType }
            };
        }
        next();
    });
});

// MongoDB Connection
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("MONGO_URL is missing in .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env");
    process.exit(1);
}

mongoose.connect(MONGO_URL, { dbName: "spmdb" })
    .then(() => {
        console.log("MongoDB Connected to database: spmdb");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// Routes
app.use("/", userRoute);
app.use("/prediction", predictionRoute);
app.use("/api", diseaseLocationRoutes);
app.use("/api_loc", locationNotificationRoutes);
app.use("/notification", notificationRoute);

// Fetch all contacts
app.get('/', async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
});

// Validation rules
const validateProblem = [
  // Use .isString() first to reject any non-string input (like objects, arrays, etc.)
  body('disease').isString().withMessage('Disease must be a text string.') // <- THIS IS THE KEY
                 .notEmpty().withMessage('Disease name is required.')
                 .trim()
                 .escape(),

  body('description').isString().withMessage('Description must be text.')
                    .notEmpty().withMessage('Description is required.')
                    .trim()
                    .escape(),
  body('category').isString().withMessage('Category must be text.')
                 .notEmpty().withMessage('Category is required.')
                 .trim()
                 .escape(),
  body('location').optional().isString().withMessage('Location must be text.').trim().escape()
];

// Add a problem
app.post("/AddProblem",validateProblem, async (req, res) => {
    // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Proceed with sanitized data in req.body
  try {
    const { disease, description, category, location } = req.body; 
    const newProblem = new ContactModel({ disease, description, category, location });
    await newProblem.save();
    res.status(200).json({ message: 'Problem added successfully!', data: newProblem });
  } catch (err) {
    res.status(500).json({ error: 'Error adding problem' });
  }
});
// Add a problem (FIXED CODE)
// app.post("/AddProblem", validateProblem, async (req, res) => {
//   // 1. Check for validation errors from the validateProblem middleware
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() }); // Send detailed error messages
//   }

//   try {
//     // Destructure the sanitized fields from req.body
//     const { disease, description, category, location } = req.body;

//     // 3. Create a new problem using the sanitized data
//     const newProblem = new ContactModel({
//       disease,
//       description,
//       category,
//       location
//     });

//     await newProblem.save();
//     res.status(200).json({ message: 'Problem added successfully!', data: newProblem });
//   } catch (err) {
//     res.status(500).json({ error: 'Error adding problem' });
//   }
// });

const validateProblemUpdate = [
  body('disease').optional().isString().trim().escape(),
  body('description').optional().isString().trim().escape(),
  body('category').optional().isString().trim().escape(),
  body('location').optional().isString().trim().escape()
];
// const validateProblemUpdate = [
//   body('disease').optional().trim().escape(), // Use optional(), not notEmpty()
//   body('description').optional().trim().escape(),
//   body('category').optional().trim().escape(),
//   body('location').optional().trim().escape()
// ];

// Update a problem
app.put("/UpdateContact/:id",validateProblemUpdate, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProblem = await ContactModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProblem);
    } catch (err) {
        res.status(500).json({ error: 'Error updating problem' });
    }
});

// Delete a problem
app.delete("/deleteContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ContactModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting problem' });
    }
});

// Fetch a single problem by ID
app.get('/getContact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

const validateSolution = [
  body('solution').notEmpty().trim().escape().withMessage('Solution text is required') 
];


// Add a solution to a problem
app.put('/addSolution/:id',validateSolution, async (req, res) => {
    const { id } = req.params;
    const { solution } = req.body;

    try {
        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        contact.solutions.push({ solution });
        await contact.save();
        res.status(200).json({ message: 'Solution added successfully', data: contact });
    } catch (err) {
        res.status(500).json({ error: 'Error adding solution. Please try again.' });
    }
});

// Fetch solutions for a problem
app.get('/getSolution/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id).populate('solutions');
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});
/*const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const dbConfig = require("./config/dbConfig");
const mongoose = require("mongoose");
const ContactModel = require('./models/contact');
const Prediction = require('./models/prediction');
const User = require('./models/User');
const router = require("./routes/router");

var predictionRoute = require("./routes/prediction_route");
var userRoute = require("./routes/user_route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// Routes
app.use(router);

// Authentication Middleware
app.use(async (req, res, next) => {
    const email = req.body.auth_email;
    const password = req.body.auth_password;

    if (email && password) {
        try {
            const user = await User.findOne({ email: email, password: password });
            if (!user) {
                return res.status(400).json({ status: "invalid_user", message: "This user is invalid." });
            }
            req.current_user = { user_id: user._id, user: user };
            next();
        } catch (error) {
            return res.status(500).json({ error: "Error during authentication" });
        }
    } else {
        req.current_user = null;
        next();
    }
});

// POST route to handle form submission for predictions
app.post('/api/predictions', async (req, res) => {
    try {
        const newPrediction = new Prediction(req.body);
        await newPrediction.save();
        res.status(200).json({ message: 'Prediction saved successfully!', newPrediction });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
});

// Fetch all contacts
app.get('/', async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
});

// Add a problem
app.post("/AddProblem", async (req, res) => {
    try {
        const newProblem = new ContactModel(req.body);
        await newProblem.save();
        res.status(200).json({ message: 'Problem added successfully!', data: newProblem });
    } catch (err) {
        res.status(500).json({ error: 'Error adding problem' });
    }
});

// Update a problem
app.put("/UpdateContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProblem = await ContactModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProblem);
    } catch (err) {
        res.status(500).json({ error: 'Error updating problem' });
    }
});

// Delete a problem
app.delete("/deleteContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ContactModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting problem' });
    }
});

// Fetch a single problem by ID
app.get('/getContact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

// Add a solution to a problem
app.put('/addSolution/:id', async (req, res) => {
    const { id } = req.params;
    const { solution } = req.body;

    try {
        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        contact.solutions.push({ solution });
        await contact.save();
        res.status(200).json({ message: 'Solution added successfully', data: contact });
    } catch (err) {
        res.status(500).json({ error: 'Error adding solution. Please try again.' });
    }
});

// Fetch solutions for a problem
app.get('/getSolution/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id).populate('solutions');
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

// Use the prediction and user routes
app.use("/prediction", predictionRoute);
app.use("/user", userRoute);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Node server started at port ${port}`));


const diseaseLocationRoutes = require('./routes/map/diseaseLocation');
app.use('/api', diseaseLocationRoutes);
const locationNotificationRoutes = require('./routes/map/notification');
app.use('/api_loc', locationNotificationRoutes);
const notificationRoute =require('./routes/map/notification_route');
app.use("/notification", notificationRoute);*/