import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  useToast,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const PortfolioView = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const toast = useToast();

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
    // Implement PDF download functionality
    toast({
      title: "Coming Soon",
      description: "PDF download feature will be available soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
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
    <Box maxW="4xl" mx="auto" p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>{portfolio.title}</Heading>
        <Button colorScheme="blue" onClick={handleDownload}>
          Download PDF
        </Button>
      </Flex>
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="md">
        <ReactMarkdown>{portfolio.content}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default PortfolioView;
