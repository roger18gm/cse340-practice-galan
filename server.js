import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

// Set the view engine to EJS. Do this before defining any routes
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory (where your templates are located) after static files are handled
app.set('views', path.join(__dirname, 'src/views'));

app.get("/", (req, res) => {
    const title = "Home page!";
    const content = '<h1>My first Node.js, Express, and EJS web application!</h1><p>Claude helped with the styling of this website</p>';
    res.render("index", { title, content })
})

app.get("/about", (req, res) => {
    const title = "about me!!";
    const content = `<h1>About Me</h1>
    <p>Thank you for visiting.</p>
    
    <div class="about-content">
        <div class="profile-section">
            <div class="profile-image">
                <img src="/images/roger.galan.headshot.jpg" alt="My Profile Picture" class="profile-pic">
            </div>
            <div class="profile-info">
                <h2>Hi, I'm Roger!</h2>
                <p>I'm a full-stack web developer passionate about creating clean, efficient, and user-friendly applications. I specialize in JavaScript, Node.js, and modern front-end frameworks.</p>
                <p>When I'm not coding, you can find me playing pickleball, playing Skyrim, or eating BBQ wings.</p>
            </div>
        </div>
        
        <h2>My Skills</h2>
        <ul class="skills-list">
            <% skills.forEach((skill) => { %>
                <li><%= skill %></li>
            <% }); %>
        </ul>
        
        <h2>Education</h2>
        <div class="education">
            <p><strong>Bachelor of Science in Software Engineering</strong><br>
            BYU-Idaho, 2023-2026</p>
        </div>
    </div>`;
    res.render("index", { title, content, skills: ["JavaScript", "Node.js", "Express", "EJS", "React", "MongoDB", "CSS", "HTML5"] })
})

app.get("/contact", (req, res) => {
    const title = "contact me!!";
    const content = `<h1>Contact me</h1>
    <p>lets chat!</p>
    
    <div class="contact-form">
        <form action="/submit" method="POST">
            <div class="form-group">
                <input type="text" name="name" placeholder="Name" required>
            </div>
            
            <div class="form-group">
                <input type="email" name="email" placeholder="Email" required>
            </div>
            
            <div class="form-group">
                <textarea name="message" placeholder="Message" rows="5" required></textarea>
            </div>
            
            <div class="form-group">
                <input type="submit" value="Submit" class="submit-btn">
            </div>
        </form>
        
        <div class="contact-info">
            <h2>Other Ways to Reach Me</h2>
            <p><strong>Email:</strong> roger18gm@gmail.com</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Location:</strong> Rexburg, ID</p>
            
            <div class="social-links">
                <a href="https://github.com/roger18gm" class="social-link">GitHub</a>
                <a href="https://www.linkedin.com/in/roger-galan-manzano/" class="social-link">LinkedIn</a>
            </div>
        </div>
    </div>`;
    res.render("index", { title, content, })
})

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});