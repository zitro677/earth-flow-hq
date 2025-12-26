
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-800 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-6">
          The page you're looking for ({location.pathname}) doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/projects")} 
          className="bg-blue-500 hover:bg-blue-600 mr-2"
        >
          Return to Projects
        </Button>
        <Button 
          onClick={() => navigate("/")} 
          variant="outline"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
