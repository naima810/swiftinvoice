'use client';

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        window.location.href = "/dashboard";
        console.log("Logged in:", data.user);

      } else {
        // SIGNUP
        const { data, error } = await supabase.auth.signUp(
          { email, password,},
          {options: { data: { full_name: name }, emailRedirectTo: null }} // disables confirmation email for dev/testing
        );
        if (error) throw error;

        // Insert into users table
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          name,
          role: "user",
          plan: "free",
        });
        if(!data.user){
 throw new Error("User not created")
}
        if (insertError) throw insertError;
        window.location.href = "/dashboard";
        console.log("Signup success and user added to users table:", data.user);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
