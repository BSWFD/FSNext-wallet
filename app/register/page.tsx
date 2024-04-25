"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { RegisterUser } from "@/lib/fetchData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    address: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValues({
      email: "",
      password: "",
      confirmpassword: "",
      address: "",
    });

    setLoading(true);

    // check password confirmation
    if (formValues.password != formValues.confirmpassword) {
      setError("Incorrect Password");
      setLoading(false);
      return;
    }

    // check address vaildation
    if (formValues.address == null) {
      setError("Please input address");
      setLoading(false);
      return;
    }

    try {
      const res = await RegisterUser(formValues);
      setLoading(false);

      // check register api response
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      const [message] = await Promise.all([res.json()]);
      if (message.message == "Success") {
        // redirect to main page
        signIn(undefined, { callbackUrl: "/" });
      } else {
        setError(message.message);
        return;
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
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
              Sign Up
            </h1>
            {error && (
              <p className="text-center text-red-500 bg-white py-4 rounded w-full">
                {error}
              </p>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg font-normal">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  value={formValues.email}
                />
              </div>
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="password"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formValues.password}
                  required
                />
              </div>
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  onChange={handleChange}
                  value={formValues.confirmpassword}
                  name="confirmpassword"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 dark:text-gray-400 text-lg">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="address"
                  onChange={handleChange}
                  value={formValues.address}
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                  type="text"
                  placeholder="Address"
                  required
                />
              </div>
              <Button className="text-white" type="submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span className="cursor-default dark:text-gray-300">
                  Have an account?
                </span>
                <Link href="/login" className="group text-blue-400 transition-all duration-100 ease-in-out">
                  <span className="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Sign In
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
