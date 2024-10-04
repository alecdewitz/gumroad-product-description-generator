"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useCompletion } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Copy, Download } from "lucide-react";

interface FormData {
  title: string;
  features: string;
  audience: string;
  tone: string;
  keywords: string;
}

export default function DescriptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      features: "",
      audience: "",
      tone: "",
      keywords: "",
    },
  });

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/generate",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    setIsGenerating(true);
    try {
      await complete(JSON.stringify(data));
    } catch (error) {
      console.error("Error generating descriptions:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadDescription = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "product-description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI-Powered Product Description Generator
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="title">Product Title</Label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => <Input id="title" {...field} />}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="features">Product Features</Label>
          <Controller
            name="features"
            control={control}
            rules={{ required: "Features are required" }}
            render={({ field }) => <Textarea id="features" {...field} />}
          />
          {errors.features && (
            <span className="text-red-500">{errors.features.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="audience">Target Audience</Label>
          <Controller
            name="audience"
            control={control}
            rules={{ required: "Target audience is required" }}
            render={({ field }) => <Input id="audience" {...field} />}
          />
          {errors.audience && (
            <span className="text-red-500">{errors.audience.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="tone">Tone</Label>
          <Controller
            name="tone"
            control={control}
            rules={{ required: "Tone is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tone && (
            <span className="text-red-500">{errors.tone.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="keywords">Keywords (Optional)</Label>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => <Input id="keywords" {...field} />}
          />
        </div>
        <Button
          type="submit"
          disabled={isGenerating || isLoading}
          className="w-full"
        >
          {isGenerating || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Description"
          )}
        </Button>
      </form>

      {completion && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Generated Description</h2>
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
              <CardDescription>Generated based on your input</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{completion}</p>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(completion)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadDescription(completion)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
