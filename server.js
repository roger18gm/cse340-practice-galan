import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { fileURLToPath } from 'url';
import path from 'path';
import { addGlobalData } from './src/middleware/index.js';
import indexRoutes from './src/routes/index.js';
import productsRoutes from './src/routes/products/index.js';
import dashboardRoutes from './src/routes/dashboard/index.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import db from './src/models/db.js';
import accountRoutes from './src/routes/accounts/index.js';
import flashMessages from './src/middleware/flash.js';


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

/**
 * Middleware
 */
// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));
app.use(addGlobalData);
// Add this after your other middleware (static files, etc.)
// Configure PostgreSQL session store
const PostgresStore = pgSession(session);

// Configure session middleware
app.use(session({
    store: new PostgresStore({
        pool: db, // Use your PostgreSQL connection
        tableName: 'sessions', // Table name for storing sessions
        createTableIfMissing: true // Creates table if it does not exist
    }),
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true, // Prevents client-side access to the cookie
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    }
}));

// Add flash message middleware (after session, before routes)
app.use(flashMessages);

/**
 * Routes
 */
app.use("/", indexRoutes);
app.use("/products", productsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/accounts', accountRoutes);

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
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, { title, error, stack });
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

app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});