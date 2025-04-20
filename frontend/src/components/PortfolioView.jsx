import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  useToast,
  Flex,
  Spinner,
  useColorModeValue,
  Text,
  Container,
  IconButton,
  Tooltip,
  Badge,
  VStack,
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";
import { DownloadIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { jsPDF } from "jspdf";

const PortfolioView = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/portfolio/${id}`
        );
        setPortfolio(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch portfolio",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, toast]);

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Set default font and styles
    doc.setFont("helvetica");
    doc.setDrawColor(41, 128, 185); // Blue color for decorative elements

    // Add decorative header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Add title with styling
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255); // White color for title
    const title = portfolio.title;
    const titleWidth = doc.getStringUnitWidth(title) * 28;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 25);

    // Reset position for content
    yPosition = 50;
    doc.setTextColor(44, 62, 80); // Dark blue-gray for regular text

    // Process content line by line
    const lines = portfolio.content.split("\n");
    let currentSection = "";
    let sectionSpacing = 15;

    lines.forEach((line) => {
      // Handle headings
      if (line.startsWith("# ")) {
        currentSection = "main";
        doc.setFontSize(24);
        doc.setTextColor(41, 128, 185);
        const heading = line.substring(2);
        const headingWidth = doc.getStringUnitWidth(heading) * 24;
        const headingX = (pageWidth - headingWidth) / 2;
        doc.text(heading, headingX, yPosition);
        yPosition += 15;
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
      }
      // Handle subheadings
      else if (line.startsWith("## ")) {
        currentSection = "sub";
        doc.setFontSize(18);
        doc.setTextColor(52, 152, 219);
        const subheading = line.substring(3);
        // Add decorative line before subheading
        doc.setDrawColor(52, 152, 219);
        doc.line(margin, yPosition - 5, margin + 100, yPosition - 5);
        doc.text(subheading, margin, yPosition);
        yPosition += 12;
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
      }
      // Handle sub-subheadings
      else if (line.startsWith("### ")) {
        currentSection = "subsub";
        doc.setFontSize(14);
        doc.setTextColor(52, 152, 219);
        const subsubheading = line.substring(4);
        doc.text(subsubheading, margin, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
      }
      // Handle bullet points
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const bulletPoint = "• " + line.substring(2);
        const splitText = doc.splitTextToSize(bulletPoint, contentWidth - 15);
        doc.text(splitText, margin + 5, yPosition);
        yPosition += splitText.length * 6;
      }
      // Handle bold text
      else if (line.includes("**")) {
        const parts = line.split("**");
        let xPos = margin;
        parts.forEach((part, index) => {
          if (index % 2 === 0) {
            doc.setFont(undefined, "normal");
          } else {
            doc.setFont(undefined, "bold");
          }
          const textWidth = doc.getStringUnitWidth(part) * 12;
          doc.text(part, xPos, yPosition);
          xPos += textWidth;
        });
        yPosition += 6;
        doc.setFont(undefined, "normal");
      }
      // Handle links
      else if (
        line.includes("[") &&
        line.includes("]") &&
        line.includes("(") &&
        line.includes(")")
      ) {
        const linkText = line.match(/\[(.*?)\]/)[1];
        const linkUrl = line.match(/\((.*?)\)/)[1];
        doc.setTextColor(41, 128, 185);
        doc.textWithLink(linkText, margin, yPosition, { url: linkUrl });
        yPosition += 6;
        doc.setTextColor(44, 62, 80);
      }
      // Handle code blocks
      else if (line.startsWith("```") || line.startsWith("`")) {
        doc.setFont("courier");
        doc.setTextColor(231, 76, 60);
        const codeText = line.replace(/```|`/g, "");
        // Add background for code blocks
        doc.setFillColor(248, 249, 250);
        doc.rect(margin - 2, yPosition - 4, contentWidth + 4, 8, "F");
        const splitText = doc.splitTextToSize(codeText, contentWidth - 10);
        doc.text(splitText, margin + 5, yPosition);
        yPosition += splitText.length * 6;
        doc.setFont("helvetica");
        doc.setTextColor(44, 62, 80);
      }
      // Handle regular text
      else if (line.trim()) {
        const splitText = doc.splitTextToSize(line, contentWidth);
        doc.text(splitText, margin, yPosition);
        yPosition += splitText.length * 6;
      }
      // Handle empty lines
      else {
        yPosition += 4;
      }

      // Add section spacing
      if (currentSection === "main" && line.trim() === "") {
        yPosition += sectionSpacing;
      }
    });

    // Add footer with decorative line
    doc.setDrawColor(41, 128, 185);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );

    doc.save(`${portfolio.title}.pdf`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      try {
        await axios.delete(`http://localhost:5000/api/portfolio/${id}`);
        toast({
          title: "Portfolio deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Navigate back to dashboard
        window.location.href = "/dashboard";
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!portfolio) {
    return (
      <Box p={4}>
        <Heading>Portfolio not found</Heading>
      </Box>
    );
  }

  return (
    <Box bg={bg} py={10} px={4} minH="100vh">
      <Container maxW="4xl">
        <VStack spacing={6} align="stretch">
          {/* Header Section */}
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
            p={4}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack align="start" spacing={2}>
              <Heading size="lg" color={textColor}>
                {portfolio.title}
              </Heading>
              <HStack spacing={2}>
                <Badge colorScheme="blue">
                  Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                </Badge>
                <Badge colorScheme={portfolio.isPublic ? "green" : "gray"}>
                  {portfolio.isPublic ? "Public" : "Private"}
                </Badge>
              </HStack>
            </VStack>
            <HStack spacing={2}>
              <Tooltip label="Download PDF">
                <IconButton
                  icon={<DownloadIcon />}
                  onClick={handleDownload}
                  colorScheme="blue"
                  variant="ghost"
                  aria-label="Download PDF"
                />
              </Tooltip>
              <Tooltip label="Delete Portfolio">
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={handleDelete}
                  colorScheme="red"
                  variant="ghost"
                  aria-label="Delete Portfolio"
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Content Section */}
          <Box
            p={{ base: 4, md: 8 }}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
          >
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <Heading
                    as="h1"
                    size="2xl"
                    mt={8}
                    mb={4}
                    color={headingColor}
                    textAlign="center"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <Heading
                    as="h2"
                    size="xl"
                    mt={8}
                    mb={4}
                    color={headingColor}
                    borderBottom="2px solid"
                    borderColor={borderColor}
                    pb={2}
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <Heading
                    as="h3"
                    size="lg"
                    mt={6}
                    mb={3}
                    color={subheadingColor}
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <Text
                    fontSize="md"
                    mb={4}
                    color={textColor}
                    lineHeight="tall"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <Box
                    as="ul"
                    pl={6}
                    mb={4}
                    style={{ listStyleType: "disc" }}
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <Box
                    as="ol"
                    pl={6}
                    mb={4}
                    style={{ listStyleType: "decimal" }}
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <Box as="li" mb={2} color={textColor} {...props} />
                ),
                a: ({ node, ...props }) => (
                  <Link
                    color="blue.500"
                    textDecoration="underline"
                    _hover={{ color: "blue.600" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => (
                  <Box
                    as="code"
                    bg={useColorModeValue("gray.100", "gray.700")}
                    p={1}
                    borderRadius="md"
                    fontSize="sm"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <Box
                    as="pre"
                    bg={useColorModeValue("gray.100", "gray.700")}
                    p={4}
                    borderRadius="md"
                    overflowX="auto"
                    mb={4}
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <Divider my={6} borderColor={borderColor} {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <Box
                    as="blockquote"
                    pl={4}
                    borderLeft="4px solid"
                    borderColor={borderColor}
                    color={subheadingColor}
                    fontStyle="italic"
                    mb={4}
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <Box
                    as="table"
                    width="100%"
                    mb={4}
                    borderCollapse="collapse"
                    {...props}
                  />
                ),
                th: ({ node, ...props }) => (
                  <Box
                    as="th"
                    p={2}
                    border="1px solid"
                    borderColor={borderColor}
                    bg={useColorModeValue("gray.100", "gray.700")}
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <Box
                    as="td"
                    p={2}
                    border="1px solid"
                    borderColor={borderColor}
                    {...props}
                  />
                ),
              }}
            >
              {portfolio.content}
            </ReactMarkdown>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PortfolioView;
