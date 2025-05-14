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

// Basic route with parameters
router.get('/explore/:category/:id', (req, res) => {
    // Log the params object to the console
    console.log('Route Parameters:', req.params);
    console.log('Query Parameters:', req.query);

    // Destructure the parameters
    const { category, id } = req.params;

    // Get query parameters (optional)
    const { sort = 'default', filter = 'none' } = req.query;

    const title = `Explore ${category}`;

    // Send a response using the parameters
    res.render(`explore`, { category, id, sort, filter, title });
});

// Products page route with display mode validation
router.get('/products/:display', validateDisplayMode, (req, res) => {
    const title = "Our Products";
    const { display } = req.params;

    // Sample product data
    const products = [
        {
            id: 1,
            name: "Kindle E-Reader",
            description: "Lightweight e-reader with a glare-free display and weeks of battery life.",
            price: 149.99,
            image: "https://picsum.photos/id/367/800/600"
        },
        {
            id: 2,
            name: "Vintage Film Camera",
            description: "Capture timeless moments with this classic vintage film camera, perfect for photography enthusiasts.",
            price: 199.99,
            image: "https://picsum.photos/id/250/800/600"
        },
        {
            id: 3,
            name: "NOt a kindle",
            description: "Fake kindle",
            price: 49.99,
            image: "https://picsum.photos/id/367/800/600"
        },
        {
            id: 4,
            name: "Fake vintage cam",
            description: "Knockoff vintage cam. Just a picture of a camera.",
            price: 9.99,
            image: "https://picsum.photos/id/250/800/600"
        },
    ];
    res.render('products', { title, products, display });
});

// Default products route (redirects to grid view)
router.get('/products', (req, res) => {
    res.redirect('/products/grid');
});

export default router;