import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginModal } from "@/components/login-modal";
import { PricingCard, pricingTiers } from "@/components/pricing-card";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { createCheckoutSession } from "@/lib/server/subscription/createCheckoutSession";
import { createPortalSession } from "@/lib/server/subscription/createPortalSession";
import { getSubscription } from "@/lib/server/subscription/getSubscription";
import { cn, getCsrfToken } from "@/lib/utils";

interface SubscriptionData {
  status: string;
  currentPeriodEnd: Date | null;
  quantity: number;
}

export default function Plans() {
  const { user, isLoading } = useSession();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  // fetch subscription if user is logged in
  useEffect(() => {
    if (user) {
      setLoadingSubscription(true);
      getSubscription({
        onSuccess: (data) => {
          setSubscription(data);
          setLoadingSubscription(false);
        },
        onError: () => {
          setSubscription(null);
          setLoadingSubscription(false);
        },
      });
    }
  }, [user]);

  const hasProSubscription = subscription?.status === "active";
  const csrfToken = getCsrfToken() || "";

  const handleTierAction = (tierName: string) => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    if (tierName === "Pro") {
      if (hasProSubscription) {
        // open customer portal
        setProcessingTier(tierName);
        createPortalSession({
          csrfToken,
          onSuccess: (url) => {
            window.location.href = url;
          },
          onError: () => {
            setProcessingTier(null);
          },
        });
      } else {
        // start checkout
        setProcessingTier(tierName);
        createCheckoutSession({
          billingPeriod,
          csrfToken,
          onSuccess: (url) => {
            window.location.href = url;
          },
          onError: () => {
            setProcessingTier(null);
          },
        });
      }
    }
    // starter tier - just go to issues if not already there
    if (tierName === "Starter") {
      navigate("/issues");
    }
  };

  // modify pricing tiers based on user's current plan
  const modifiedTiers = pricingTiers.map((tier) => {
    const isCurrentPlan = tier.name === "Pro" && hasProSubscription;
    const isStarterCurrent = tier.name === "Starter" && !hasProSubscription;

    return {
      ...tier,
      highlighted: isCurrentPlan || (!hasProSubscription && tier.name === "Pro"),
      cta: isCurrentPlan
        ? "Manage subscription"
        : isStarterCurrent
          ? "Current plan"
          : tier.name === "Pro"
            ? "Upgrade to Pro"
            : tier.cta,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="w-full flex h-14 items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Sprint" className="size-12 -mt-0.5" />
            <span className="text-3xl font-basteleur font-700 transition-colors -mt-0.5">Sprint</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="hidden md:block text-sm font-500 hover:text-personality transition-colors"
            >
              Home
            </Link>
            <div className="flex items-center gap-2">
              {!isLoading && user ? (
                <Button asChild variant="outline" size="sm">
                  <Link to="/issues">Open app</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setLoginModalOpen(true)}>
                  Sign in
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-16 pt-14 px-4">
        <div className="max-w-6xl w-full space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-basteleur font-700">
              {user ? "Choose your plan" : "Simple, transparent pricing"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {user
                ? hasProSubscription
                  ? "You are currently on the Pro plan. Manage your subscription or switch plans below."
                  : "You are currently on the Starter plan. Upgrade to Pro for unlimited access."
                : "Choose the plan that fits your team. Scale as you grow."}
            </p>

            {/* billing toggle */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "text-lg transition-colors",
                  billingPeriod === "monthly" ? "text-foreground font-700" : "text-muted-foreground",
                )}
              >
                monthly
              </button>
              <Switch
                size="lg"
                checked={billingPeriod === "annual"}
                onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                className="bg-border data-[state=checked]:bg-border! data-[state=unchecked]:bg-border!"
                thumbClassName="bg-personality dark:bg-personality data-[state=checked]:bg-personality! data-[state=unchecked]:bg-personality!"
                aria-label="toggle billing period"
              />
              <button
                type="button"
                onClick={() => setBillingPeriod("annual")}
                className={cn(
                  "text-lg transition-colors",
                  billingPeriod === "annual" ? "text-foreground font-700" : "text-muted-foreground",
                )}
              >
                annual
              </button>
              <span className="text-sm px-3 py-1 bg-personality/10 text-personality rounded-full font-600">
                Save 17%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {modifiedTiers.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                billingPeriod={billingPeriod}
                onCtaClick={() => handleTierAction(tier.name)}
                disabled={processingTier !== null || tier.name === "Starter"}
                loading={processingTier === tier.name}
              />
            ))}
          </div>

          {/* trust signals */}
          <div className="grid md:grid-cols-3 gap-8 w-full border-t pt-16 pb-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center gap-2">
              <Icon icon="eyeClosed" iconStyle={"pixel"} className="size-8" color="var(--personality)" />
              <p className="font-700">Secure & Encrypted</p>
              <p className="text-sm text-muted-foreground">Your data is safe with us</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Icon
                icon="creditCardDelete"
                iconStyle={"pixel"}
                className="size-8"
                color="var(--personality)"
              />
              <p className="font-700">Free Starter Plan</p>
              <p className="text-sm text-muted-foreground">Get started instantly</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Icon icon="rotateCcw" iconStyle={"pixel"} className="size-8" color="var(--personality)" />
              <p className="font-700">Money Back Guarantee</p>
              <p className="text-sm text-muted-foreground">30-day no-risk policy</p>
            </div>
          </div>
        </div>
      </main>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
