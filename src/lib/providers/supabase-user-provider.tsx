'use client'

import { AuthUser } from "@supabase/supabase-js"
import { Subscription } from "../supabase/supabase.types"
import React, { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getUserSubscriptionStatus } from "../supabase/queries"
import { useToast } from "@/components/ui/use-toast"


type SupabaseUserContextType = {
    user:AuthUser|null;
    subscription: Subscription|null;
}


const SupabaseUserContext = createContext<SupabaseUserContextType>({
    user:null,
    subscription: null,
})

export const useSupabaseUser = ()=>{
    return useContext(SupabaseUserContext)
}

interface SupabaseUserProviderProps{
    children:React.ReactNode
}


const SupbaseUserProvider : React.FC<SupabaseUserProviderProps> =({children})=>{
    const supabase = createClientComponentClient();
    const {toast} = useToast()
    const [subscription, setSubscription] = useState<Subscription|null>(null);
    const [user,setUser] = useState<AuthUser | null>(null) 
    // fetch the user details
    // subscription details
    useEffect(()=>{
        const getUser = async()=>{
            const {data:{user}} =  await supabase.auth.getUser()  
        // console.log(user)
        if(user){
            setUser(user)
            const {data,error} = await getUserSubscriptionStatus(user.id)
            if(data)setSubscription(data);
            if(error){
                toast({
                    title:'Unexpected error',
                    description:'Oops! An unexpected error occurred, please try again'
                })
            } 
        }
    }
        getUser();

    },[supabase,toast])
    return <SupabaseUserContext.Provider value={{user,subscription}}>
        {children}
    </SupabaseUserContext.Provider>
}
export default SupbaseUserProvider;