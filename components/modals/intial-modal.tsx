"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import FileUpload from "@/components/file-upload";
import axios from "axios";

const formSchema = z.object({
  serverName: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .max(50),
  serverImageUrl: z.string(),
});

const InitialModal = ({ userId }: { userId?: string }) => {
  const [imageUrl, setImageUrl] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: "",
      serverImageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    const { serverName, serverImageUrl } = values;
    try {
      const response = await axios.post("/api/server", {
        name: serverName,
        imageUrl: serverImageUrl,
        userId
      });

      console.log("response is :", response);
    } catch (error) {
      console.log("Error while creating server:", error);
    }
  };

  const isLoading = form.formState.isLoading;

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and image. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="serverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server image</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="imageUploader"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter server name"
                      {...field}
                      className="text-black bg-zinc-300/50  border-0 focus:visible:right-0 focus:visible:ring-offset-0"
                      disabled={isLoading}
                    />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-500 text-white hover:bg-indigo-500/90"
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
