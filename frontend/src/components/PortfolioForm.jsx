import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  SimpleGrid,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PortfolioForm = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    personalDetails: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    skills: [],
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        technologies: [""],
        link: "",
      },
    ],
  });

  const handleInputChange = (section, index, field, value) => {
    if (section === "personalDetails") {
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          [field]: value,
        },
      }));
    } else if (section === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) => {
          if (i === index) {
            return { ...item, [field]: value };
          }
          return item;
        }),
      }));
    }
  };

  const addItem = (section) => {
    if (section === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, ""],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: [...prev[section], {}],
      }));
    }
  };

  const removeItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/generate",
        formData
      );
      toast({
        title: "Portfolio generated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Navigate to the generated portfolio
      navigate(`/portfolio/${response.data._id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to generate portfolio",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" mt={8} p={6}>
      <Heading mb={6} color="blue.600">
        Create Your Portfolio
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {/* Personal Details */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4} color="blue.500">
              Personal Details
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.personalDetails.name}
                  onChange={(e) =>
                    handleInputChange(
                      "personalDetails",
                      null,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Your full name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.personalDetails.email}
                  onChange={(e) =>
                    handleInputChange(
                      "personalDetails",
                      null,
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="your.email@example.com"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.personalDetails.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "personalDetails",
                      null,
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="Your phone number"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={formData.personalDetails.location}
                  onChange={(e) =>
                    handleInputChange(
                      "personalDetails",
                      null,
                      "location",
                      e.target.value
                    )
                  }
                  placeholder="Your location"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl mt={4}>
              <FormLabel>Professional Summary</FormLabel>
              <Textarea
                value={formData.personalDetails.summary}
                onChange={(e) =>
                  handleInputChange(
                    "personalDetails",
                    null,
                    "summary",
                    e.target.value
                  )
                }
                placeholder="Write a brief summary about yourself"
                rows={4}
              />
            </FormControl>
          </Box>

          {/* Skills */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4} color="blue.500">
              Skills
            </Heading>
            <VStack spacing={4} align="stretch">
              {formData.skills.map((skill, index) => (
                <HStack key={index}>
                  <Input
                    value={skill}
                    onChange={(e) =>
                      handleInputChange("skills", index, "", e.target.value)
                    }
                    placeholder="Enter a skill"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => removeItem("skills", index)}
                    colorScheme="red"
                    variant="ghost"
                    aria-label="Remove skill"
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => addItem("skills")}
                colorScheme="blue"
                variant="outline"
                width="full"
              >
                Add Skill
              </Button>
            </VStack>
          </Box>

          {/* Education */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4} color="blue.500">
              Education
            </Heading>
            {formData.education.map((edu, index) => (
              <Box
                key={index}
                mb={4}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Institution</FormLabel>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="University/School name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Degree</FormLabel>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          index,
                          "degree",
                          e.target.value
                        )
                      }
                      placeholder="Degree/Certification"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Field of Study</FormLabel>
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          index,
                          "field",
                          e.target.value
                        )
                      }
                      placeholder="Field of study"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={edu.description}
                    onChange={(e) =>
                      handleInputChange(
                        "education",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe your education experience"
                    rows={3}
                  />
                </FormControl>
                <Button
                  leftIcon={<DeleteIcon />}
                  onClick={() => removeItem("education", index)}
                  colorScheme="red"
                  variant="ghost"
                  mt={2}
                >
                  Remove Education
                </Button>
              </Box>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={() => addItem("education")}
              colorScheme="blue"
              variant="outline"
              width="full"
            >
              Add Education
            </Button>
          </Box>

          {/* Experience */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4} color="blue.500">
              Experience
            </Heading>
            {formData.experience.map((exp, index) => (
              <Box
                key={index}
                mb={4}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Company</FormLabel>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      placeholder="Company name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Position</FormLabel>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      placeholder="Your position"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe your responsibilities and achievements"
                    rows={4}
                  />
                </FormControl>
                <Button
                  leftIcon={<DeleteIcon />}
                  onClick={() => removeItem("experience", index)}
                  colorScheme="red"
                  variant="ghost"
                  mt={2}
                >
                  Remove Experience
                </Button>
              </Box>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={() => addItem("experience")}
              colorScheme="blue"
              variant="outline"
              width="full"
            >
              Add Experience
            </Button>
          </Box>

          {/* Projects */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4} color="blue.500">
              Projects
            </Heading>
            {formData.projects.map((project, index) => (
              <Box
                key={index}
                mb={4}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
              >
                <FormControl>
                  <FormLabel>Project Title</FormLabel>
                  <Input
                    value={project.title}
                    onChange={(e) =>
                      handleInputChange(
                        "projects",
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Project name"
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      handleInputChange(
                        "projects",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe your project"
                    rows={4}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Technologies Used</FormLabel>
                  <VStack spacing={2}>
                    {project.technologies.map((tech, techIndex) => (
                      <HStack key={techIndex} width="full">
                        <Input
                          value={tech}
                          onChange={(e) => {
                            const newTechs = [...project.technologies];
                            newTechs[techIndex] = e.target.value;
                            handleInputChange(
                              "projects",
                              index,
                              "technologies",
                              newTechs
                            );
                          }}
                          placeholder="Technology name"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => {
                            const newTechs = project.technologies.filter(
                              (_, i) => i !== techIndex
                            );
                            handleInputChange(
                              "projects",
                              index,
                              "technologies",
                              newTechs
                            );
                          }}
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Remove technology"
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        const newTechs = [...project.technologies, ""];
                        handleInputChange(
                          "projects",
                          index,
                          "technologies",
                          newTechs
                        );
                      }}
                      colorScheme="blue"
                      variant="outline"
                      width="full"
                    >
                      Add Technology
                    </Button>
                  </VStack>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Project Link</FormLabel>
                  <Input
                    value={project.link}
                    onChange={(e) =>
                      handleInputChange(
                        "projects",
                        index,
                        "link",
                        e.target.value
                      )
                    }
                    placeholder="Project URL or repository link"
                  />
                </FormControl>
                <Button
                  leftIcon={<DeleteIcon />}
                  onClick={() => removeItem("projects", index)}
                  colorScheme="red"
                  variant="ghost"
                  mt={2}
                >
                  Remove Project
                </Button>
              </Box>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={() => addItem("projects")}
              colorScheme="blue"
              variant="outline"
              width="full"
            >
              Add Project
            </Button>
          </Box>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={loading}
            loadingText="Generating Portfolio..."
            width="full"
            mt={4}
          >
            Generate Portfolio
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PortfolioForm;
