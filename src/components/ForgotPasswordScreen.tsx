import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import unikonetLogo from "@/assets/unikonet-logo.png";

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password reset logic here
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
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

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your school email to receive a password reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-11 text-foreground border-border/50 placeholder:text-muted-foreground rounded-2xl bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-md mt-4"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 animate-scale-in">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Check your email
              </h2>
              <p className="text-muted-foreground text-sm mb-8 px-4">
                We've sent a password reset link to <br/>
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-all duration-300 shadow-md"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
