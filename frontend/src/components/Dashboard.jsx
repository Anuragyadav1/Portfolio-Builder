import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  useToast,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/portfolio");
        setPortfolios(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch portfolios",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [toast]);

  const handleCreateNew = () => {
    navigate("/create");
  };

  const handleViewPortfolio = (id) => {
    navigate(`/portfolio/${id}`);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>My Portfolios</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleCreateNew}
        >
          Create New Portfolio
        </Button>
      </Flex>

      {portfolios.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" mb={4}>
            You haven't created any portfolios yet
          </Text>
          <Button colorScheme="blue" onClick={handleCreateNew}>
            Create Your First Portfolio
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {portfolios.map((portfolio) => (
            <Card
              key={portfolio._id}
              cursor="pointer"
              onClick={() => handleViewPortfolio(portfolio._id)}
            >
              <CardHeader>
                <Heading size="md">{portfolio.title}</Heading>
              </CardHeader>
              <CardBody>
                <Text noOfLines={3}>
                  {portfolio.personalDetails?.summary || "No summary available"}
                </Text>
              </CardBody>
              <CardFooter>
                <Text fontSize="sm" color="gray.500">
                  Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                </Text>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Dashboard;
