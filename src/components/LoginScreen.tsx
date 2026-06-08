import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import unikonetLogo from "@/assets/unikonet-logo.png";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [schoolEmail, setSchoolEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Login logic here
    console.log("Login attempt:", { schoolEmail, password });
    // Navigate to university selection after successful login
    navigate("/select-university");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-6 py-8 font-inter">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="bg-background rounded-3xl p-8 shadow-elegant border border-border/20 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={unikonetLogo} 
              alt="Unikonet Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Unikonet Login
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your school email and password to sign in
            </p>
          </div>

          <div className="space-y-6">
            {/* School Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                School Email
              </label>
              <Input
                type="email"
                placeholder="you@university.edu.ng"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="h-12 text-foreground border-border/50 placeholder:text-muted-foreground rounded-xl bg-muted/20 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-foreground border-border/50 placeholder:text-muted-foreground pr-12 rounded-xl bg-muted/20 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;