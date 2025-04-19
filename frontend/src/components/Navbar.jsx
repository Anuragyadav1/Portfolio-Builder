import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={bg} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" maxW="6xl" mx="auto">
        <RouterLink to="/">
          <Heading size="md">Portfolio Builder</Heading>
        </RouterLink>
        <Spacer />
        {user ? (
          <Flex gap={4}>
            <RouterLink to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </RouterLink>
            <Button colorScheme="red" onClick={logout}>
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <RouterLink to="/login">
              <Button variant="ghost">Login</Button>
            </RouterLink>
            <RouterLink to="/signup">
              <Button colorScheme="blue">Sign Up</Button>
            </RouterLink>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
