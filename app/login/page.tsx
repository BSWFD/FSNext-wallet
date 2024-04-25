"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValues({ email: "", password: "" });

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formValues.email,
      password: formValues.password,
      callbackUrl: "/"
    });

    setLoading(false);

    if (!res?.error) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setError("");
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="flex font-poppins items-center justify-center dark:bg-gray-900 min-w-screen min-h-screen">
      <div className="grid gap-8 w-[500px]">
        <div id="back-div" className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold text-5xl dark:text-gray-400 text-center cursor-default">
              Sign In
            </h1>
            {error && (
              <p className="text-center text-red-500 py-4 rounded">{error}</p>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg">Email</Label>
                <Input
                  name="email"
                  onChange={handleChange}
                  value={formValues.email}
                  className=" border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg">
                  Password
                </Label>
                <Input
                  onChange={handleChange}
                  value={formValues.password}
                  name="password"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <Button className="text-white" disabled={loading} type="submit">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span className="cursor-default dark:text-gray-300">
                  Don't have an account?
                </span>
                <Link href="/register" className="group text-blue-400 transition-all duration-100 ease-in-out">
                  <span className="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Sign Up
                  </span>
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
