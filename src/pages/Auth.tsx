import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Package, Mail, Lock, User, Loader2, Store, Briefcase, ShoppingBag, MapPin, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMarkets } from "@/hooks/useMarkets";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const phoneSchema = z.string().length(10, "Phone must be 10 digits").regex(/^0[2-5][0-9]{8}$/, "Invalid Ghanaian phone").optional().or(z.literal(""));

type SignupRole = "consumer" | "vendor" | "shopper";

const roleInfo: Record<SignupRole, { icon: typeof Package; label: string; description: string; color: string }> = {
  consumer: {
    icon: ShoppingBag,
    label: "Customer",
    description: "Order products from local markets",
    color: "gradient-primary",
  },
  vendor: {
    icon: Store,
    label: "Vendor",
    description: "Sell your products at markets",
    color: "gradient-market",
  },
  shopper: {
    icon: Briefcase,
    label: "Shopper",
    description: "Earn by delivering orders",
    color: "gradient-gold",
  },
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, roles, signIn, signUp, loading, hasRole, addRole } = useAuth();
  const { markets, loading: marketsLoading } = useMarkets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1 = role selection, 2 = details
  
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ 
    email: "", 
    password: "", 
    fullName: "",
    phone: "",
    // Vendor-specific
    businessName: "",
    marketId: "",
    stallNumber: "",
    // Shopper-specific
    shopperMarketId: "",
  });
  const [selectedRole, setSelectedRole] = useState<SignupRole>("consumer");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get intended role from URL params (e.g., /auth?role=vendor)
  useEffect(() => {
    const roleParam = searchParams.get("role") as SignupRole | null;
    if (roleParam && ["consumer", "vendor", "shopper"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Redirect authenticated users based on their roles
  useEffect(() => {
    if (user && !loading && roles.length > 0 && !isSubmitting) {
      // Small delay to ensure roles are synced
      const timer = setTimeout(() => {
        redirectBasedOnRole();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, roles, isSubmitting]);

  const redirectBasedOnRole = () => {
    // Prioritize the selected role during signup, otherwise use hierarchy
    if (hasRole("admin")) {
      navigate("/admin", { replace: true });
    } else if (hasRole("vendor")) {
      navigate("/vendor", { replace: true });
    } else if (hasRole("shopper")) {
      navigate("/shopper", { replace: true });
    } else {
      navigate("/consumer", { replace: true });
    }
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      emailSchema.parse(signInForm.email);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.signInEmail = e.errors[0].message;
    }
    
    try {
      passwordSchema.parse(signInForm.password);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.signInPassword = e.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      nameSchema.parse(signUpForm.fullName);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.fullName = e.errors[0].message;
    }
    
    try {
      emailSchema.parse(signUpForm.email);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.signUpEmail = e.errors[0].message;
    }
    
    try {
      passwordSchema.parse(signUpForm.password);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.signUpPassword = e.errors[0].message;
    }

    if (signUpForm.phone) {
      try {
        phoneSchema.parse(signUpForm.phone);
      } catch (e) {
        if (e instanceof z.ZodError) newErrors.phone = e.errors[0].message;
      }
    }

    // Role-specific validation
    if (selectedRole === "vendor") {
      if (!signUpForm.businessName) {
        newErrors.businessName = "Business name is required";
      }
      if (!signUpForm.marketId) {
        newErrors.marketId = "Please select a market";
      }
    }

    if (selectedRole === "shopper") {
      if (!signUpForm.shopperMarketId) {
        newErrors.shopperMarketId = "Please select your market area";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setIsSubmitting(true);
    const { error } = await signIn(signInForm.email, signInForm.password);
    setIsSubmitting(false);
    
    if (error) {
      toast.error(error.message === "Invalid login credentials" 
        ? "Invalid email or password. Please check your credentials."
        : error.message);
    } else {
      toast.success("Welcome back!");
      // Redirect will happen via useEffect
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    
    setIsSubmitting(true);
    const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);
    
    if (error) {
      setIsSubmitting(false);
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // Add the selected role if not consumer (consumer is default)
    if (selectedRole !== "consumer") {
      const { error: roleError } = await addRole(selectedRole);
      if (roleError) {
        console.error("Failed to add role:", roleError);
      }
    }

    setIsSubmitting(false);
    toast.success("Account created successfully! Welcome to KwikMarket.");
    // Redirect will happen via useEffect
  };

  const handleNextStep = () => {
    // Validate role selection
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    setSignupStep(2);
  };

  const handleBackStep = () => {
    setSignupStep(1);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Package className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">KwikMarket</h1>
          <p className="text-muted-foreground mt-2">Your market, delivered fresh</p>
        </div>

        <Card variant="elevated" className="border-2">
          <CardHeader className="text-center pb-2">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setSignupStep(1)}>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.signInEmail && (
                      <p className="text-sm text-destructive">{errors.signInEmail}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.signInPassword && (
                      <p className="text-sm text-destructive">{errors.signInPassword}</p>
                    )}
                  </div>

                  <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <AnimatePresence mode="wait">
                  {signupStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Role Selection */}
                      <div className="space-y-3">
                        <Label>I want to join as</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(Object.keys(roleInfo) as SignupRole[]).map((role) => {
                            const info = roleInfo[role];
                            const Icon = info.icon;
                            const isSelected = selectedRole === role;
                            
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`
                                  relative p-3 rounded-xl border-2 transition-all duration-200
                                  flex flex-col items-center gap-1.5 text-center
                                  ${isSelected 
                                    ? "border-primary bg-primary/5 shadow-sm" 
                                    : "border-muted hover:border-muted-foreground/30"
                                  }
                                `}
                              >
                                <div className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center`}>
                                  <Icon className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xs font-medium">{info.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {roleInfo[selectedRole].description}
                        </p>
                      </div>

                      <Button type="button" variant="hero" className="w-full" onClick={handleNextStep}>
                        Continue
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      {/* Back button */}
                      <Button type="button" variant="ghost" size="sm" onClick={handleBackStep} className="mb-2">
                        ← Back to role selection
                      </Button>

                      {/* Common fields */}
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullname"
                            type="text"
                            placeholder="Kofi Asante"
                            value={signUpForm.fullName}
                            onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={signUpForm.email}
                            onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                        {errors.signUpEmail && <p className="text-sm text-destructive">{errors.signUpEmail}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="0244123456"
                            value={signUpForm.phone}
                            onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                            className="pl-10"
                          />
                        </div>
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={signUpForm.password}
                            onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                        {errors.signUpPassword && <p className="text-sm text-destructive">{errors.signUpPassword}</p>}
                      </div>

                      {/* Vendor-specific fields */}
                      {selectedRole === "vendor" && (
                        <div className="space-y-4 pt-2 border-t">
                          <p className="text-sm font-medium text-primary flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Vendor Details
                          </p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name *</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="businessName"
                                placeholder="e.g., Auntie Akua's Fresh Produce"
                                value={signUpForm.businessName}
                                onChange={(e) => setSignUpForm({ ...signUpForm, businessName: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                            {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="marketId">Market Location *</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <select
                                id="marketId"
                                className="w-full h-10 pl-10 pr-3 rounded-md border bg-background text-sm"
                                value={signUpForm.marketId}
                                onChange={(e) => setSignUpForm({ ...signUpForm, marketId: e.target.value })}
                              >
                                <option value="">Select your market</option>
                                {markets.map((market) => (
                                  <option key={market.id} value={market.id}>{market.name}</option>
                                ))}
                              </select>
                            </div>
                            {errors.marketId && <p className="text-sm text-destructive">{errors.marketId}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="stallNumber">Stall Number (Optional)</Label>
                            <Input
                              id="stallNumber"
                              placeholder="e.g., A-15"
                              value={signUpForm.stallNumber}
                              onChange={(e) => setSignUpForm({ ...signUpForm, stallNumber: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Shopper-specific fields */}
                      {selectedRole === "shopper" && (
                        <div className="space-y-4 pt-2 border-t">
                          <p className="text-sm font-medium text-gold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Shopper Details
                          </p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="shopperMarketId">Your Market Area *</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <select
                                id="shopperMarketId"
                                className="w-full h-10 pl-10 pr-3 rounded-md border bg-background text-sm"
                                value={signUpForm.shopperMarketId}
                                onChange={(e) => setSignUpForm({ ...signUpForm, shopperMarketId: e.target.value })}
                              >
                                <option value="">Select the market you'll work at</option>
                                {markets.map((market) => (
                                  <option key={market.id} value={market.id}>{market.name}</option>
                                ))}
                              </select>
                            </div>
                            {errors.shopperMarketId && <p className="text-sm text-destructive">{errors.shopperMarketId}</p>}
                            <p className="text-xs text-muted-foreground">
                              You'll receive job notifications from this market
                            </p>
                          </div>
                        </div>
                      )}

                      <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          `Create ${roleInfo[selectedRole].label} Account`
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
