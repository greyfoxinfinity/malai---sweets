"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ShieldCheck, ShoppingBag, UserPlus, LogIn } from "lucide-react";

type Mode = "customer-login" | "customer-register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("customer-login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin login
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  async function handleCustomerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "customer-register") {
        const res = await fetch("/api/auth/customer-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, phone, address }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === "customer-register" ? "Account created but login failed. Try logging in." : "Invalid email or password");
      } else {
        router.push("/cart");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      const result = await signIn("credentials", {
        email: adminEmail,
        password: adminPassword,
        redirect: false,
      });

      if (result?.error) {
        setAdminError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setAdminError("Login failed. Please try again.");
    }
    setAdminLoading(false);
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f5f1] px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b5e3c]">
          Welcome to Malai
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Choose your space.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60">
          Shop our current menu as a customer, or log in to manage the products
          shown in the storefront.
        </p>

        <div className="mt-10 grid gap-6 text-left lg:grid-cols-2">
          {/* Customer Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8">
            <ShoppingBag size={28} className="text-[#8b5e3c]" />
            <h2 className="mt-6 text-2xl font-semibold">Customer</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Log in or create an account to save your details for faster checkout.
            </p>

            {/* Mode tabs */}
            <div className="mt-5 flex gap-2 rounded-full bg-[#f7f5f1] p-1">
              <button
                type="button"
                onClick={() => { setMode("customer-login"); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors ${mode === "customer-login" ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}
              >
                <LogIn size={15} /> Login
              </button>
              <button
                type="button"
                onClick={() => { setMode("customer-register"); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors ${mode === "customer-register" ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}
              >
                <UserPlus size={15} /> Register
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="mt-5 space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {mode === "customer-register" && (
                <>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]"
                  />
                  <input
                    type="text"
                    placeholder="Delivery address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]"
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Please wait..." : mode === "customer-login" ? "Login to your account" : "Create account & login"}
              </button>
            </form>
            <Link href="/shop" className="mt-4 block text-center text-sm text-black/50 hover:text-black">
              Skip for now — browse as guest →
            </Link>
          </div>

          {/* Admin Card */}
          <div className="rounded-3xl bg-[#17130f] p-6 text-white sm:p-8">
            <ShieldCheck size={28} />
            <h2 className="mt-6 text-2xl font-semibold">Admin</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Log in to add products, edit prices, change photos, manage settings, and view transactions.
            </p>
            <form onSubmit={handleAdminLogin} className="mt-5 space-y-3">
              {adminError && <p className="text-sm text-red-400">{adminError}</p>}
              <input
                type="email"
                placeholder="Admin email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full rounded-full bg-[#d4a373] px-5 py-3.5 text-sm font-semibold text-black disabled:opacity-50"
              >
                {adminLoading ? "Logging in..." : "Login to dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
