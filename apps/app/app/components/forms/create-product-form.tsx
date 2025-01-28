// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { ProductPriceAmountType, ProductPriceType } from "@prisma/client";
// import { Button } from "@repo/design-system/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@repo/design-system/components/ui/form";
// import { Input } from "@repo/design-system/components/ui/input";
// import { Textarea } from "@repo/design-system/components/ui/textarea";
// import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
// import { toast, useToast } from "@repo/design-system/components/ui/use-toast";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useCreateProduct } from "@repo/features/product/mutations/use-create-product";

// export const createProductSchema = z.object({
//   name: z.string().min(2, {
//     message: "Product name must be at least 2 characters.",
//   }),
//   description: z.string().optional(),
//   prices: z
//     .array(
//       z.object({
//         type: z.enum(["one_time", "recurring"]),
//         recurringInterval: z.enum(["month", "year"]).optional(),
//         amountType: z.enum(["fixed", "custom", "free"]),
//         amount: z.number().min(0).optional(),
//         minimumAmount: z.number().min(0).optional(),
//         maximumAmount: z.number().min(0).optional(),
//         presetAmount: z.number().min(0).optional(),
//       }),
//     )
//     .min(1, {
//       message: "At least one price must be added.",
//     }),
// });

// type ProductFormValues = z.infer<typeof createProductSchema>;

// export function CreateProductForm() {
//   const mutation = useCreateProduct();
//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(createProductSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       prices: [
//         {
//           type: ProductPriceType.one_time,
//           amountType: ProductPriceAmountType.fixed,
//           amount: 1,
//         },
//       ],
//     },
//   });

//   function onSubmit(data: ProductFormValues) {
//     mutation.mutate(data, {
//       onSuccess: () => {
//         toast({ title: "product created successfully" });
//       },
//       onError: () => {
//         toast({ title: "cannot create product" });
//       },
//       onSettled: () => {},
//     });
//   }

//   return (
//     <div className="p-8">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="">
//           <div className="max-w-4xl mx-auto  rounded-2xl border overflow-hidden bg-white ">
//             <ScrollArea className="p-8 h-[600px] ">
//               <div className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="mysaas" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product Description</FormLabel>
//                       <FormControl>
//                         <Textarea placeholder="mysaas bla bla bla" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </ScrollArea>
//           </div>
//           <Button
//             disabled={mutation.isPending}
//             type="submit"
//             className="w-full"
//           >
//             Create Product
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }
