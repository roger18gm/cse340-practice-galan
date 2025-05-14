// Middleware to add global data to res.locals
export const addGlobalData = (req, res, next) => {
    // Get the current year for copyright notice
    res.locals.currentYear = new Date().getFullYear();

    // Add NODE_ENV for all views
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';

    // log the http method and url we're attempting to access 
    console.log(`Method: ${req.method}, URL: ${req.url}`);

    // Global middleware to set a custom header
    res.setHeader('X-Powered-By', 'Express Middleware Tutorial');

    // Middleware to add a timestamp to res.locals for all views
    // Create a formatted timestamp like "May 8, 2025 at 3:42 PM"
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    // Adding to res.locals makes this available to all views automatically
    res.locals.timestamp = now.toLocaleDateString('en-US', options);


    // Global middleware to measure request processing time
    // Record the time when the request started
    const start = Date.now();

    /**
     * The `res` object has built-in event listeners we can use to trigger
     * actions at different points in the request/response lifecycle.
     * 
     * We will use the 'finish' event to detect when the response has been
     * sent to the client, and then calculate the time taken to process
     * the entire request.
     */
    res.on('finish', () => {
        // Calculate how much time has passed since the request started
        const end = Date.now();
        const processingTime = end - start;

        // Log the results to the console
        console.log(`${req.method} ${req.url} - Processing time: ${processingTime}ms`);
    });

    next();
};