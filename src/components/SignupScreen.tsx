import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import unikonetLogo from "@/assets/unikonet-logo.png";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const SignupScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic here
    console.log("Signup attempt:", { fullName, schoolEmail, password });
    // Navigate to university selection after successful signup
    navigate("/select-university");
  };

  const handleGoogleSignup = () => {
    console.log("Google Signup attempt");
    // Simulate successful Google Signup
    navigate("/select-university");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center px-6 py-8 font-inter relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center mr-3 group-hover:bg-background/80 transition-colors shadow-sm glass-card">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 shadow-elegant animate-fade-in relative overflow-hidden">
          {/* Subtle top accent border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={unikonetLogo} 
              alt="Unikonet Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join your campus community today
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-14 pl-11 text-foreground border-border/50 placeholder:text-muted-foreground rounded-2xl bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* School Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                School Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  type="email"
                  placeholder="you@university.edu.ng"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  className="h-14 pl-11 text-foreground border-border/50 placeholder:text-muted-foreground rounded-2xl bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-11 pr-12 text-foreground border-border/50 placeholder:text-muted-foreground rounded-2xl bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-md mt-4"
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 flex items-center justify-center">
            <div className="h-px bg-border/80 flex-1"></div>
            <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Or continue with
            </span>
            <div className="h-px bg-border/80 flex-1"></div>
          </div>

          {/* Social Login */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-14 text-base font-medium bg-background hover:bg-muted/50 border-border/80 text-foreground rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center shadow-sm"
          >
            <GoogleIcon />
            Google
          </Button>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="font-semibold text-primary hover:text-primary-glow transition-colors ml-1"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
