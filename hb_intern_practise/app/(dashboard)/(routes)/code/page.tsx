"use client"
import {Heading} from "@/components/heading"
import Link from "next/link"
import {  useForm } from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import formSchema from "./constants"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form" // 注意重名类
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChatCompletionRequestMessage } from "openai"
import { Code } from "lucide-react"
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal"
import toast from "react-hot-toast"
const CodePage = () =>{
    const proModal = useProModal()
    const router = useRouter();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:"",
        },
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        try{
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt,
            };
            const newMessages = [...messages,userMessage];

            const response = await axios.post("/api/code",{
                messages: newMessages,
            });

            setMessages((current) => [...current, userMessage, response.data]);
            form.reset();
        } catch(error: any) {
            console.log(error);
            if (error?.response?.status === 403) {  
                proModal.onOpen();
            } else {
                toast.error("An error occured")
            }
        } finally{
            router.refresh();
        }
    }
    console.log(333)
    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate use the descriptive text"
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10"
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
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none 
                                                focus-visible:ring-0
                                                focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="simple toggle button using react hooks"
                                                {...field}  //add propt such as blur that being members of field
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                    Generate
                                </Button>
                            </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div key={message.content}>
                                {/* {message.content} */}
                                <ReactMarkdown
                                    components={{
                                        pre: ({node,...props}) =>(
                                            <div  className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ),
                                        code: ({ node,...props}) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props}></code>
                                        )
                                    }}
                                    className = "text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default CodePage