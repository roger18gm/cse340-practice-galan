import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Create an instance of an Express application
const app = express();

// Set the view engine to EJS. Do this before defining any routes
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory (where your templates are located) after static files are handled
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to add current year to res.locals
app.use((req, res, next) => {
    // Get the current year for copyright notice
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.get("/", (req, res) => {
    const title = "Home";
    res.render("index", { title, NODE_ENV, PORT });
})

app.get("/about", (req, res) => {
    const title = "About Me";
    const skills = ["JavaScript", "Node.js", "Express", "EJS", "React", "MongoDB", "CSS", "HTML5"];
    res.render("about", { title, skills, NODE_ENV, PORT });
})

app.get("/contact", (req, res) => {
    const title = "Contact Me";
    res.render("contact", { title, NODE_ENV, PORT });
})

// Basic route with parameters
app.get('/explore/:category/:id', (req, res) => {
    // Log the params object to the console
    console.log('Route Parameters:', req.params);
    console.log('Query Parameters:', req.query);

    // Destructure the parameters
    const { category, id } = req.params;

    // Get query parameters (optional)
    const { sort = 'default', filter = 'none' } = req.query;

    const title = `Explore ${category}`;

    // Send a response using the parameters
    res.render(`explore`, { category, id, sort, filter, title, NODE_ENV });
});



// // Test route that deliberately throws an error
// app.get('/test-error', (req, res, next) => {
//     try {
//         // Intentionally trigger an error
//         const nonExistentVariable = undefinedVariable;
//         res.send('This will never be reached');
//     } catch (err) {
//         // Forward the error to the global error handler
//         next(err);
//     }
// });

// // Test route that explicitly creates and forwards an error
// app.get('/manual-error', (req, res, next) => {
//     const err = new Error('This is a manually triggered error');
//     err.status = 500;
//     next(err); // Forward to the global error handler
// });

/**
 * Error Handling Middleware
 */

// Catch-all middleware for unmatched routes (404)
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Forward to the global error handler
});

// Global error handler middleware
app.use((err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);

    // Set default status and determine error type
    const status = err.status || 500;
    const title = status === 404 ? 'Page Not Found' : 'Internal Server Error';
    const error = err.message;
    const stack = err.stack;

    // Render the appropriate template based on status code
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, { title, error, stack, NODE_ENV });
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});