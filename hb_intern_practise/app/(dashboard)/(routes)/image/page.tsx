"use client"
import {Heading} from "@/components/heading"
import Link from "next/link"
import {  useForm } from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import formSchema, { amountOptions, resolutionOptions } from "./constants"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form" // 注意重名类
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ImageIcon, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProModal } from "@/hooks/use-pro-modal"
import toast from "react-hot-toast"

const ImagePage = () =>{
    const proModal = useProModal()
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt: "",
            amount: "1",
            resolution: "512x512",
        },
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        try{
            setImages([]);
            const response = await axios.post("/api/image",values);
            console.log("response.data!!!!!!!!:",response.data)

            const urls = response.data.map((image:{url: string }) => image.url)
            setImages([urls]);
            form.reset();
            
        } catch(error: any) {
            // console.log(error);
            if (error?.response?.status === 403) {  
                proModal.onOpen();
            } else {
                toast.error("An error occured")
            }
        } finally{
            router.refresh();
        }
    }
    return (
        <div>
            <Heading
                title="Image Generation"
                description="Turn your prompt into an image"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
            />
            
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                            rounded-lg
                            border
                            w-full
                            p-4
                            px-3
                            md:px-6
                            focus-within:shadow-sm
                            grid
                            grid-cols-12
                            gapo-12"    
                        >
                                <FormField
                                name="prompt"
                                render={({field})=>(
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none 
                                                focus-visible:ring-0
                                                focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="A wolf in the cold winter forest"
                                                {...field}  //add propt such as blur that being members of field
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {amountOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {
                                                    option.label
                                                }
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="resolution"
                                    render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {resolutionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </FormItem>
                                    )}
                                />

                                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading} type="submit" size="icon">
                                    Generate
                                </Button>
                            </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div>
                        image will be there
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default ImagePage