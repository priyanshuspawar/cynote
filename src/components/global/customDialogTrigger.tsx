"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";

interface CustomDialogTriggerProps {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  header,
  content,
  children,
  description,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsDialogOpen}>
      <DialogTrigger className={clsx("", className)}>{children}</DialogTrigger>
      <DialogContent
        className="h-screen
        block
        overflow-x-hidden
        sm:h-[440px]
        overflow-y-scroll
        w-full
      "
      >
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogTrigger;
