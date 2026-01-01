import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store the token
      localStorage.setItem("token", token);

      // Fetch user profile
      fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Store user data
            localStorage.setItem("user", JSON.stringify(data.user));

            toast({
              title: "Success",
              description: "Logged in with Google successfully!",
            });

            // Redirect based on role
            if (data.user.role === 'admin') {
              window.location.href = "/admin/dashboard";
            } else {
              window.location.href = "/symptoms";
            }
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
          toast({
            title: "Error",
            description: "Failed to complete authentication",
            variant: "destructive",
          });
          navigate("/login");
        });
    } else {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
