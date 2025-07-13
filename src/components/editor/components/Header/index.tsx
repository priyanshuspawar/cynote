"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetFilesDetailsQuery,
  useUpdateFileMutation,
} from "@/redux/services/fileApi";
import React, { useCallback, useMemo, useRef, useState } from "react";
import DragImagePosition from "../../drag-image-reposition";
import { SuggestedImages } from "@/lib/constants";
import Image from "next/image";
import { ImageIcon, Inbox, MessageCircle, Smile, XCircle } from "lucide-react";
import debounce from "lodash/debounce";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/helpers/client";
import EmojiPicker from "@/components/global/emojiPicker";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/providers/colab-user-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = ({ id }: { id: string }) => {
  const { data: fileData, error, isError } = useGetFilesDetailsQuery(id);
  const [updateFile, { error: fileUpdateError }] = useUpdateFileMutation();
  const supabase = createClient();
  const { toast } = useToast();
  const [position, setPosition] = useState<{ x: number; y: number }>();
  const [isDragable, setIsDragable] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(fileData?.title);
  const { state } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedUpdateBannerUrl = useMemo(
    () => debounce(async (url: string) => updateBannerUrlToDb(url), 300),
    [fileData?.id]
  );
  const handleBannerChange = useCallback(
    (url: string | null) => {
      debouncedUpdateBannerUrl(url || "");
    },
    [debouncedUpdateBannerUrl]
  );

  if (!fileData || error) {
    return;
  }
  // states

  //handlers
  const handleFileUpload = async () => {
    if (selectedFile) {
      const customUrl = await uploadCustomBanner(selectedFile);
      handleBannerChange(customUrl);
    }
  };
  const uploadCustomBanner = async (file: File): Promise<string> => {
    try {
      const { data } = await supabase.storage
        .from("banners")
        .upload(`custom-banner-${id}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!data?.path) throw new Error("Failed to upload image");

      const {
        data: { publicUrl },
      } = supabase.storage.from("banners").getPublicUrl(data.path);
      return publicUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong uploading";
      toast({
        title: `Failed to upload file: ${errorMessage}`,
        variant: "destructive",
      });
      return "";
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const updateBannerUrlToDb = async (bannerUrl: string) => {
    if (!fileData.folderId) return;
    const updatedData = { bannerUrl, folderId: fileData.folderId };

    try {
      const { error } = await updateFile({
        updatedData,
        fileId: fileData.id,
      });
      if (error) throw error;
      toast({
        title: "Banner Updated Successfully",
      });
    } catch (error) {
      toast({ title: "Error updating banner" });
    }
  };

  const updateIconId = async (iconId: string) => {
    if (!fileData.folderId) {
      return;
    }
    const updatedData = { iconId, folderId: fileData.folderId };
    try {
      const { error } = await updateFile({ updatedData, fileId: fileData.id });
      if (error) throw error;
      toast({ title: "Icon updated successfully" });
    } catch (error) {
      toast({ title: "Error updating icon", variant: "destructive" });
    }
  };

  const handleDoubleClick = () => {
    setIsTitleEditing(true);
  };
  const handleTitleBlur = async () => {
    if (!fileData.folderId) return;
    setIsTitleEditing(false);

    const updatedData = {
      title: tempTitle,
      folderId: fileData.folderId,
    };
    try {
      const { error } = await updateFile({ updatedData, fileId: fileData.id });
      if (error) {
        throw new Error("Error updating file");
      }
    } catch (error) {
      toast({ title: "Error updating file", variant: "destructive" });
    }
  };

  return (
    <div className="w-full">
      {/* colab and online users */}
      <div className="w-full min-h-[20vh] group/parent flex flex-col items-center justify-end">
        {/* Banner */}
        {fileData.bannerUrl && (
          <div className="relative w-full h-fit group mb-8">
            {/* image */}
            <DragImagePosition
              fileId={fileData.id}
              isDragable={isDragable}
              url={fileData.bannerUrl}
              onChangePosition={setPosition}
            />
            <div className="opacity-0 absolute bg-Neutrals/neutrals-10 bottom-10 right-10 group-hover:opacity-100 flex text-xs py-1 px-2 rounded-md gap-1 transition-all duration-500 cursor-pointer ease-in-out">
              <Popover>
                <PopoverTrigger>
                  <span className="hover:text-washed-purple-500">
                    Change Banner
                  </span>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col w-96 px-3 py-2 bg-brand-dark">
                  <span className="text-sm text-neutral-200">Banners</span>
                  <div className="grid grid-cols-4 gap-2 my-2">
                    {SuggestedImages.map((banner) => (
                      <div
                        key={banner.id}
                        onClick={() => handleBannerChange(banner.imgUrl)}
                        className="relative cursor-pointer aspect-square"
                      >
                        <Image
                          src={banner.imgUrl}
                          fill
                          alt={`Banner ${banner.id}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => inputRef.current?.click()}
                      className="bg-transparent text-sm hover:text-neutral-400 cursor-pointer transition-colors duration-500 text-neutral-600 flex gap-2 items-center h-fit"
                      aria-label="Upload a new banner"
                    >
                      <Inbox className="w-4" />
                      <input
                        ref={inputRef}
                        id="bannerUpload"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <label className="leading-none">
                        {selectedFile ? selectedFile.name : "Upload"}
                      </label>
                    </div>
                    {selectedFile && (
                      <button
                        onClick={handleFileUpload}
                        className="mt-2 text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {"|"}
              <span
                onClick={() => {
                  if (isDragable) {
                    console.log(position);
                    window.localStorage.setItem(
                      fileData.id,
                      JSON.stringify(position)
                    );
                  }
                  setIsDragable(!isDragable);
                }}
                className="hover:text-washed-purple-500"
              >
                {isDragable ? "Save Position" : "Reposition"}
              </span>
            </div>
          </div>
        )}
        <Options
          onChangeBanner={handleBannerChange}
          emoji={fileData.iconId}
          updateIcon={updateIconId}
          banner={fileData.bannerUrl}
        />
        <div
          onDoubleClick={handleDoubleClick}
          className="my-4 flex justify-start w-4/6"
        >
          <input
            onBlur={handleTitleBlur}
            value={tempTitle ?? fileData.title}
            className="text-3xl select-none font-semibold tracking-wide focus:outline-none bg-transparent"
            readOnly={!isTitleEditing}
            onChange={(e) => setTempTitle(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;

const Options = ({
  onChangeBanner,
  emoji: initialEmoji,
  updateIcon,
  banner,
}: {
  onChangeBanner: (data: string | null) => void;
  emoji: string;
  updateIcon: (iconId: string) => void;
  banner: string | null;
}) => {
  const [emoji, setEmoji] = useState<string>(initialEmoji);

  const handleBannerAction = () => {
    if (banner) {
      onChangeBanner(null); // Remove banner if already set
    } else {
      const firstBanner = SuggestedImages[0];
      onChangeBanner(firstBanner.imgUrl); // Add first banner from suggestions if not set
    }
  };

  return (
    <div className="w-4/6 flex items-start relative">
      <div className="w-fit gap-2 grid grid-cols-3 group/options transition-all transform duration-300 ease-in">
        {/* Icon */}
        <div className={cn("relative", { "col-span-full": emoji !== "" })}>
          <EmojiPicker
            getValue={(s) => {
              setEmoji(s);
              updateIcon(s);
            }}
          >
            <div className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg relative">
              {emoji && (
                <XCircle
                  onClick={() => setEmoji("📄")}
                  className="hidden group-hover:block absolute top-0 right-0.5 w-3 text-washed-purple-800"
                />
              )}
              {emoji ? (
                <span className="text-5xl">{emoji}</span>
              ) : (
                <>
                  <Smile className="w-4 h-4" />
                  <span className="leading-none">Add icon</span>
                </>
              )}
            </div>
          </EmojiPicker>
        </div>

        {/* Add/Remove Banner */}
        <div
          onClick={handleBannerAction}
          className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="leading-none">
            {banner ? "Remove cover" : "Add cover"}
          </span>
        </div>

        {/* Add Comment */}
        <div className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg">
          <MessageCircle className="w-4 h-4" />
          <span className="leading-none">Add comment</span>
        </div>
      </div>
    </div>
  );
};
