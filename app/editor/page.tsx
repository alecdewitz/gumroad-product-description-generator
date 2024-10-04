"use client";

import { useState, useEffect, useRef } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Check,
  Copy,
  ListIcon,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { experimental_useObject as useObject } from "ai/react";
import { z } from "zod";

interface FormData {
  productTitle: string;
  productFeatures: { value: string }[];
  targetAudience: string;
  tone: string;
  keywords: string;
  length: string;
}

// Define the schema for the object
const descriptionSchema = z.object({
  descriptions: z.array(
    z.object({
      name: z.string().describe("Optimized name of a product."),
      description: z.string().describe("Description of the product."),
    })
  ),
});

export default function DescriptionGenerator() {
  const {
    object,
    isLoading: isGenerating,
    submit,
  } = useObject({
    api: "/api/generate",
    schema: descriptionSchema,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      productTitle: "",
      productFeatures: [{ value: "" }],
      targetAudience: "",
      tone: "professional",
      keywords: "",
      length: "medium",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productFeatures",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      submit(JSON.stringify(data));
    } catch (error) {
      console.error("Error generating descriptions:", error);
    }
  };
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

  const handleCopy = (index: number, description: string) => {
    navigator.clipboard.writeText(description);

    // Reset any previously copied index
    setCopiedIndex(null);

    // Set the new copied index
    setCopiedIndex(index);

    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    const timer = setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);

    setResetTimer(timer);
  };

  const descriptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating && descriptionsRef.current) {
      descriptionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [isGenerating]);

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:sticky md:top-8 h-full flex flex-col flex-1 max-w-2xl"
        >
          <div>
            <Label htmlFor="productTitle">Name</Label>
            <p className="text-sm text-gray-500 mb-1">
              Give your digital product a catchy, descriptive name.
            </p>
            <Controller
              name="productTitle"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  placeholder="e.g., AI Wordpress Plugin, 100 Days of Code, Fitness for Beginners"
                  id="productTitle"
                  {...field}
                />
              )}
            />

            {errors.productTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productTitle.message}
              </p>
            )}
          </div>
          <div>
            <Label>Features</Label>
            <p className="text-sm text-gray-500 mb-1">
              List the main things your product can do, one per line.
            </p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <ListIcon className="h-4 w-4 text-gray-400" />
                <Controller
                  name={`productFeatures.${index}.value`}
                  control={control}
                  rules={{ required: "Features are required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={`Feature ${index + 1}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const currentValue = field.value.trim();
                          if (currentValue !== "") {
                            append({ value: "" });
                          }
                        } else if (
                          e.key === "Backspace" &&
                          field.value === "" &&
                          index > 0
                        ) {
                          e.preventDefault();
                          remove(index);
                          const prevInput = document.querySelector(
                            `input[name="productFeatures.${index - 1}.value"]`
                          ) as HTMLInputElement;
                          if (prevInput) {
                            prevInput.focus();
                            // Move cursor to the end of the input
                            const len = prevInput.value.length;
                            prevInput.setSelectionRange(len, len);
                          }
                        }
                      }}
                    />
                  )}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}

            {errors.productFeatures && (
              <p className="text-red-500 text-sm mt-1">
                At least one feature is required
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another feature
            </Button>
          </div>
          <div>
            <Label htmlFor="targetAudience">Target audience</Label>
            <p className="text-sm text-gray-500 mb-1">
              Describe who will use your product (age, interests, needs).
            </p>
            <Controller
              name="targetAudience"
              control={control}
              rules={{ required: "Target audience is required" }}
              render={({ field }) => (
                <Input
                  id="targetAudience"
                  {...field}
                  placeholder="e.g., Small business owners, fitness enthusiasts, high school students"
                />
              )}
            />

            {errors.targetAudience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.targetAudience.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="tone">Tone of the description</Label>
            <p className="text-sm text-gray-500 mb-1">
              Choose how you want your product description to sound.
            </p>
            <Controller
              name="tone"
              control={control}
              rules={{ required: "Tone is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="innovative">Innovative</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="solution-oriented">
                      Solution-oriented
                    </SelectItem>
                    <SelectItem value="visionary">Visionary</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.tone && (
              <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <p className="text-sm text-gray-500 mb-1">
              Add words people might use to search for your product.
            </p>
            <Controller
              name="keywords"
              control={control}
              render={({ field }) => <Input id="keywords" {...field} />}
            />
          </div>
          <div>
            <Label htmlFor="length">Description length</Label>
            <p className="text-sm text-gray-500 mb-1">
              Pick how detailed you want your description to be.
            </p>
            <Controller
              name="length"
              control={control}
              rules={{ required: "Description length is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.length && (
              <p className="text-red-500 text-sm mt-1">
                {errors.length.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </form>
        <div
          id="descriptions"
          ref={descriptionsRef}
          className="flex flex-col flex-1"
        >
          {object?.descriptions && object.descriptions.length > 0 ? (
            <div className="">
              <h2 className="text-xl font-semibold mb-4">
                Your Product Descriptions{" "}
                <span className="text-xs text-gray-500">(AI-Generated)</span>
              </h2>
              {object.descriptions.map((description, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="font-bold">{description?.name}</p>
                  <p className="whitespace-pre-wrap">
                    {description?.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        handleCopy(index, description?.description || "")
                      }
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          ) : isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="flex border-dotted border-4 py-4 px-8 border-gray-200 rounded-md flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                No descriptions yet
              </h2>
              <p className="text-gray-500 mb-4 max-w-sm">
                Fill out the form and click &quot;Create&quot; to build your
                product descriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
