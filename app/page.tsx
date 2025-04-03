"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const locales = {
  en: "English",
  de: "Deutsch",
  es: "Español",
};

const localesData = {
  title: {
    en: "English title",
    de: "Deutsch title",
    es: "Español title",
  },
  description: {
    en: "English description",
    de: "Deutsch description",
    es: "Español description",
  },
};

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

export default function Home() {
  const [values, setValues] = useState({
    title: { en: "", de: "", es: "" },
    description: { en: "", de: "", es: "" },
    input: { en: "", de: "", es: "" },
    textarea: { en: "", de: "", es: "" },
    type: { en: "all", de: "all", es: "all" },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: values.type.en as "all" | "mentions" | "none",
    },
  });

  const [locale, setLocale] = useState("en");

  useEffect(() => {
    form.reset({ type: values.type[locale] as "all" | "mentions" | "none" });
  }, [locale, form, values.type]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setValues((prev) => ({
      ...prev,
      type: {
        ...prev.type,
        [locale]: data.type,
      },
    }));
    console.log(JSON.stringify(data, null, 2));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        [locale]: value,
      },
    }));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        {Object.entries(locales).map(([key, value]) => (
          <p
            key={key}
            onClick={() => setLocale(key)}
            className={`${key === locale ? "font-bold text-red-500" : ""}`}
          >
            {key} {value}
          </p>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <p>Static title: {localesData.title[locale]}</p>
          <input
            type="text"
            name="title"
            placeholder="Edit title"
            className="block mb-2"
            value={values.title[locale]}
            onChange={handleInputChange}
          />
        </div>
        <hr className="my-2" />

        <div>
          <p>Static description: {localesData.description[locale]}</p>
          <input
            type="text"
            name="description"
            placeholder="Edit description"
            className="bg-white block text-black"
            value={values.description[locale]}
            onChange={handleInputChange}
          />
          <hr className="my-2" />
          <Input
            value={values.input[locale]}
            onChange={handleInputChange}
            name="input"
            placeholder="Edit input"
          />
          <hr className="my-2" />
          <Textarea
            value={values.textarea[locale]}
            onChange={handleInputChange}
            name="textarea"
            placeholder="Edit textarea"
          />
          <hr className="my-2" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Notify me about...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            All new messages
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mentions" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Direct messages and mentions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="none" />
                          </FormControl>
                          <FormLabel className="font-normal">Nothing</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <hr className="my-2" />

        <button
          onClick={() => console.log(values)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Log All Values
        </button>
      </div>
    </div>
  );
}
