"use client"
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EmojiClickData } from 'emoji-picker-react';

type EmojiPickerProps = {
    children: React.ReactNode;
    getValue?: (emoji:string)=>void;
}

const EmojiPicker = ({getValue,children}: EmojiPickerProps) => {
  const Picker = dynamic(()=>import('emoji-picker-react'))
  const onClick = (selectedEmoji:EmojiClickData)=>{
    if(getValue) getValue(selectedEmoji.emoji)
  }
  const [isPopoverOpen,setIspopoverOpen] = useState(false)
  
  return (
    <div className='flex items-center'>
        <Popover open={isPopoverOpen} onOpenChange={setIspopoverOpen}>
            <PopoverTrigger className='cursor-pointer'>{children}</PopoverTrigger>
            <PopoverContent className='flex bg-inherit flex-col p-0 border-none'>
                <Picker width={300} height={350} onEmojiClick={(e)=>{
                  onClick(e)
                  setIspopoverOpen(false)
                  }}/>
            </PopoverContent>
        </Popover>
    </div>
  )
}

export default EmojiPicker;