
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
        <p className="text-xl text-gray-800 mb-6">¡Ups! Página no encontrada</p>
        <p className="text-gray-600 mb-6">
          La página que buscas ({location.pathname}) no existe o fue movida.
        </p>
        <Button 
          onClick={() => navigate("/projects")} 
          className="bg-blue-500 hover:bg-blue-600 mr-2"
        >
          Volver a Proyectos
        </Button>
        <Button 
          onClick={() => navigate("/")} 
          variant="outline"
        >
          Ir al Panel
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
