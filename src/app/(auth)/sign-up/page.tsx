"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

export default function App() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    axios
      .post("/api/sign-up", data)
      .then((res) => {
        console.log(res);
        signIn("credentials", {
          username: data.username,
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            console.log(callback);
            // router.push("/signin");
            //   router.refresh();
            toast.success("Account Sign In successfully");
          }
          if (callback?.error) {
            //   toast.error(callback.error);
          }
        });
        if (res.status === 200) {
          toast.success("Account created successfully");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      })
      .finally(() => {
        //   setIsLoading(false);
      });
  };

  return (
    <div>
      <form className="flex space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label>First Name</label>
        <input {...register("username")} />

        <label>First Name</label>
        <input {...register("email")} />
        <label>First Name</label>
        <input {...register("password")} />

        <input type="submit" />
      </form>
    </div>
  );
}
