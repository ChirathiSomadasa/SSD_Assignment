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

// Import sanitization utility
const { sanitizeHtml, sanitizeContact } = require("./utils/sanitize");

// Routes
const userRoute = require("./routes/user_route");
const predictionRoute = require("./routes/prediction_route");
const diseaseLocationRoutes = require("./routes/map/diseaseLocation");
const locationNotificationRoutes = require("./routes/map/notification");
const notificationRoute = require("./routes/map/notification_route");
const detailsRoutes = require("./routes/router");
const contactRoute = require("./routes/contact_route");

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
    origin: ["http://localhost:3000", "http://localhost:3001"],
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
app.use("/details", detailsRoutes);
app.use("/contact", contactRoute);


// Fetch all contacts
app.get('/', async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        // Sanitize all contacts before sending to client
        const sanitizedContacts = contacts.map(contact => sanitizeContact(contact.toObject()));
        res.status(200).json(sanitizedContacts);
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
                 .escape() .customSanitizer(value => sanitizeHtml(value)), 

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

const validateProblemUpdate = [
  body('disease').optional().isString().trim().escape(),
  body('description').optional().isString().trim().escape(),
  body('category').optional().isString().trim().escape(),
  body('location').optional().isString().trim().escape()
];

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

