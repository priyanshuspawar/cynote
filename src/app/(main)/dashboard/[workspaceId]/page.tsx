"use client"
import SideBar from '@/components/sidebar/sidebar'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const WorkspacePage =  () => {
    const {workspaceId:id} = useParams()
    return (
    <div>
        sd
    </div>
  )
}

export default WorkspacePage