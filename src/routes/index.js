import { Router } from 'express';

const router = Router();

// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        const error = new Error('Invalid display mode: must be either "grid" or "details".');
        next(error); // Pass control to the error-handling middleware
    }
    next(); // Pass control to the next middleware or route
};

router.get("/", (req, res) => {
    const title = "Home";
    res.render("index", { title });
})

router.get("/about", (req, res) => {
    const title = "About Me";
    const skills = ["JavaScript", "Node.js", "Express", "EJS", "React", "MongoDB", "CSS", "HTML5"];
    res.render("about", { title, skills });
})

router.get("/contact", (req, res) => {
    const title = "Contact Me";
    res.render("contact", { title });
})



export default router;