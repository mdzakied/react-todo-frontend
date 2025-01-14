import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import AuthService from "@services/AuthService";
import Notification from "@shared/components/Notification/Notification";

import Logo from "@/assets/images/rongsox-logo.png";
import HeroLogin from "@/assets/images/recycle.png";

import toast from "react-hot-toast";

// create schema for validator with zod
const schema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  // use service or shared component with useMemo -> prevent re-render
  const authService = useMemo(() => AuthService(), []);
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // use state
  const [visiblePassword, setVisiblePassword] = useState(false);

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // register -> useMutation react query
  const { mutate: registerAccount, isPending } = useMutation({
    mutationFn: async (payload) => {
      // login
      return await authService.register(payload);
    },
    onSuccess: (data) => {
      // conditional redirect
      if (data && data.statusCode === 2000) {
        // notification
        notification.showSuccess("Register success, go to login page !");

        navigate("/login");
      }
    },
    onError: (error) => {
      // data user disabled or incorrect username or password
      if (error) {
        // notification
        toast.error(`${error.response.data.errorMessage}`, {
          duration: 3000,
          style: {
            border: "1px solid #f4024f",
            padding: "10px",
            color: "#f4024f",
          },
          iconTheme: {
            primary: "#f4024f",
            secondary: "#FFFAEE",
          },
        });

        // notification.showError({
        //   message: error.response.data.errorMessage,
        // });
      }
    },
  });

  const onSubmit = (data) => {
    // login -> useMutation react query
    registerAccount(data);

    // reset form
    reset();
  };

  return (
    <>
      {/* Login Page */}
      <section id="loginPage">
        <div className="flex flex-row justify-content-center align-items-center flex-wrap h-screen">
          <div className="grid w-full align-items-center ">
            {/* Login Form */}
            <div className="col-12 md:col-6 md:px-6 lg:px-8">
              {/* Logo */}
              <div className="mb-4">
                <img src={Logo} alt="logo" className="w-8rem" />
              </div>

              {/* Title */}
              <div className="ml-1">
                <h2 className="font-semibold my-0">Log in to your account.</h2>
                <p className="text-sm text-gray-400">
                  Enter your username address and password to log in.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
                  {/* Form Email */}
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-envelope"></i>
                    </span>
                    <InputText
                      {...register("email")}
                      id="email"
                      placeholder="Email"
                      variant="filled"
                      className="p-inputtext-sm w-full lg:w-10"
                      aria-describedby="email-help"
                    />
                  </div>

                  {/* Error Email */}
                  {errors.email && (
                    <small id="email-help" className="text-xs p-error">
                      {errors.email.message}
                    </small>
                  )}

                  {/* Username */}
                  <div className="p-inputgroup flex-1 mt-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      {...register("username")}
                      id="username"
                      placeholder="Username"
                      variant="filled"
                      className="p-inputtext-sm w-full lg:w-10"
                      aria-describedby="username-help"
                    />
                  </div>

                  {/* Error Username */}
                  {errors.username && (
                    <small id="username-help" className="text-xs p-error">
                      {errors.username.message}
                    </small>
                  )}

                  {/* Password */}
                  <div className="p-inputgroup flex-1 mt-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      {...register("password")}
                      id="password"
                      type={visiblePassword ? "text" : "password"}
                      placeholder="Password"
                      variant="filled"
                      className="p-inputtext-sm w-full"
                      aria-describedby="password-help"
                    />

                    {/* Button Visibility Password */}
                    <span
                      onClick={() => setVisiblePassword(!visiblePassword)}
                      className="p-inputgroup-addon cursor-pointer p-0"
                    >
                      <i
                        className={
                          visiblePassword ? "pi pi-eye-slash" : "pi pi-eye"
                        }
                      ></i>
                    </span>
                  </div>

                  {/* Error Username */}
                  {errors.password && (
                    <small id="password-help" className="text-xs p-error">
                      {errors.password.message}
                    </small>
                  )}

                  {/* Login Button */}
                  <div>
                    <Button
                      label={isPending ? "Loading..." : "Submit"}
                      className="bgn-success w-full mt-4 py-2"
                      severity="success"
                      size="small"
                      disabled={!isValid || isPending}
                    />
                  </div>
                </div>
              </form>

              {/* Login Button */}
              <div>
                <Button
                  label={isPending ? "Loading..." : "Sign in"}
                  className="bg-gray-600 w-full mt-2 py-2 border-none hover:bg-gray-500"
                  severity="success"
                  size="small"
                  disabled={!isValid || isPending}
                />
              </div>
            </div>

            {/* Image Ilustration */}
            <div className="col-12 md:col-6 hidden md:flex align-items-center">
              <img src={HeroLogin} alt="HeroLogin" className="w-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
