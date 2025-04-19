const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middleware/auth");
const Portfolio = require("../models/Portfolio");
dotenv.config();

// console.log("gemini key", process.env.GEMINI_API_KEY)

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use the correct model

// Generate portfolio
router.post("/generate", auth, async (req, res) => {
  try {
    const { personalDetails, skills, education, experience, projects } = req.body;

    // Create prompt for Gemini
    const prompt = `Generate a professional portfolio based on the following details:
    Personal Details: ${JSON.stringify(personalDetails)}
    Skills: ${skills.join(", ")}
    Education: ${JSON.stringify(education)}
    Experience: ${JSON.stringify(experience)}
    Projects: ${JSON.stringify(projects)}
    
    Please generate a well-structured portfolio in Markdown format. Include sections for:
    1. Introduction/About Me
    2. Skills
    3. Education
    4. Experience
    5. Projects
    6. Contact Information
    
    Make it professional and engaging.`;

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const generatedContent = response.text(); // Retrieve the content

    // Create new portfolio
    const portfolio = new Portfolio({
      user: req.user._id,
      title: `${personalDetails.name}'s Portfolio`,
      content: generatedContent,
      personalDetails,
      skills,
      education,
      experience,
      projects,
    });

    await portfolio.save();

    // Add portfolio to user's portfolios array
    req.user.portfolios.push(portfolio._id); // Make sure req.user has portfolios array
    await req.user.save();

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's portfolios
router.get("/", auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id });
    res.json(portfolios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single portfolio
router.get("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update portfolio
router.put("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete portfolio
router.delete("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
