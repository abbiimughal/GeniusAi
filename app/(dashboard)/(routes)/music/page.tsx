'use client'
import * as z from 'zod'
import Heading from "@/components/Heading"
import { Music } from "lucide-react"
import { useForm } from "react-hook-form"
import { formShema } from './constants'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Empty from '@/components/Empty'
import {Loader} from '@/components/Loader'



const MusicPage = () => {
    const form = useForm<z.infer<typeof formShema>>({
        resolver: zodResolver(formShema),
        defaultValues:{
            prompt:''
        }
    });
    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async(values:z.infer<typeof formShema>)=>{
        try{
          setMusic(undefined);
  
          const response = await axios.post("/api/music", values);
          setMusic(response.data)
         
          form.reset();

        }catch(error:any){
          console.log(error)
        }
        finally{
          router.refresh()
        }
    }
  return (
    <div>
        <Heading
        title="Music Generation" 
        description="Turn your prompt into Music"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="Guitar Solo" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-700 hover:text-emerald-100 col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
            </div>
            <div className='mt-4 space-y-4'>
              {isLoading && (
                <div className='p-8 rounded-lg flex justify-center items-center w-full bg-muted'>
                 <Loader/>
                </div>
              )}
              {!music && !isLoading && (
                <Empty label='No Music Generated'/>
              )}
              {music && (
                <audio controls className='w-full mt-8'>
                  <source src={music}/>
                </audio>
              )}
            </div>
        </div>
    </div>
  )
}

export default MusicPage