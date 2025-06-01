import { Router } from 'express';
const router = Router();

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