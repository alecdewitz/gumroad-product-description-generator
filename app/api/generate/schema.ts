import { z } from "zod";

// define a schema for the descriptions
export const descriptionSchema = z.object({
  descriptions: z.array(
    z.object({
      name: z.string().describe("Optimized name of a product."),
      description: z.string().describe("Description of the product."),
    })
  ),
});
