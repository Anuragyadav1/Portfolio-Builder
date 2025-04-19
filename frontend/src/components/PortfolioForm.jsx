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

const PortfolioForm = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    personalDetails: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    skills: [""],
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
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], {}],
    }));
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
      // Handle success - maybe navigate to portfolio view
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
      <Heading mb={6}>Create Your Portfolio</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {/* Personal Details */}
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Personal Details
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
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
                />
              </FormControl>
            </SimpleGrid>
            <FormControl mt={4}>
              <FormLabel>Summary</FormLabel>
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
              />
            </FormControl>
          </Box>

          {/* Skills */}
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Skills
            </Heading>
            {formData.skills.map((skill, index) => (
              <HStack key={index} mb={2}>
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
                />
              </HStack>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={() => addItem("skills")}
              mt={2}
            >
              Add Skill
            </Button>
          </Box>

          {/* Education */}
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Education
            </Heading>
            {formData.education.map((edu, index) => (
              <Box key={index} mb={4} p={4} borderWidth="1px" borderRadius="md">
                <SimpleGrid columns={2} spacing={4}>
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
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Field</FormLabel>
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
              mt={2}
            >
              Add Education
            </Button>
          </Box>

          {/* Experience */}
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Experience
            </Heading>
            {formData.experience.map((exp, index) => (
              <Box key={index} mb={4} p={4} borderWidth="1px" borderRadius="md">
                <SimpleGrid columns={2} spacing={4}>
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
              mt={2}
            >
              Add Experience
            </Button>
          </Box>

          {/* Projects */}
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Projects
            </Heading>
            {formData.projects.map((project, index) => (
              <Box key={index} mb={4} p={4} borderWidth="1px" borderRadius="md">
                <FormControl>
                  <FormLabel>Title</FormLabel>
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
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Technologies</FormLabel>
                  {project.technologies.map((tech, techIndex) => (
                    <HStack key={techIndex} mb={2}>
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
                        placeholder="Enter a technology"
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
                    mt={2}
                  >
                    Add Technology
                  </Button>
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
              mt={2}
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
          >
            Generate Portfolio
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PortfolioForm;
