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
    const { personalDetails, skills, education, experience, projects } =
      req.body;

    // Create prompt for Gemini
    const prompt = `Generate a professional portfolio based on the following details:
    Personal Details: ${JSON.stringify(personalDetails)}
    Skills: ${skills.join(", ")}
    Education: ${JSON.stringify(education)}
    Experience: ${JSON.stringify(experience)}
    Projects: ${JSON.stringify(projects)}
    
    Please generate a well-structured portfolio in Markdown format with the following sections and styling:
    
    1. Header Section
       - Use a large, bold name as the main title
       - Add a professional title/role below the name
       - Include a brief tagline or summary
       - Add contact information in a clean format
    
    2. About Me
       - Write a compelling introduction
       - Focus on professional background and expertise
       - Highlight key strengths and values
       - Keep it concise but impactful
    
    3. Skills
       - Group skills into clear categories
       - Use bullet points with proper indentation
       - Highlight key skills in bold
       - Include skill levels or expertise where relevant
    
    4. Education
       - List education in reverse chronological order
       - Use clear formatting for each entry
       - Include institution, degree, field, and dates
       - Add relevant achievements or highlights
    
    5. Experience
       - List experience in reverse chronological order
       - Use clear formatting for each entry
       - Include company, position, and dates
       - Add bullet points for key responsibilities
       - Focus on quantifiable achievements
    
    6. Projects
       - List projects in reverse chronological order
       - Use clear formatting for each entry
       - Include project title, description, and technologies
       - Add bullet points for key features
       - Include links if available
    
    7. Contact Information
       - Add a clean, professional contact section
       - Include all relevant contact methods
    
    Use the following Markdown formatting:
    - Use # for the main title (name)
    - Use ## for section headers
    - Use ### for subsection headers
    - Use bullet points (*) for lists with proper indentation
    - Use bold (**) for emphasis on key points
    - Use proper spacing between sections (add blank lines)
    - Format dates consistently (e.g., "Jan 2023 - Present")
    - Make links clickable with proper formatting
    - Use code blocks (\`\`) for technical terms
    - Use horizontal rules (---) to separate major sections
    - Use proper line breaks for readability
    
    Ensure the content is:
    1. Well-organized with clear hierarchy
    2. Visually appealing when rendered
    3. Easy to read and scan
    4. Professional in tone and presentation
    5. Properly spaced and formatted
    6. Free of placeholder text or examples
    
    Do not include any horizontal scrollbars or overflow issues in the formatting.`;

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const generatedContent = response.text();

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
    req.user.portfolios.push(portfolio._id);
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
