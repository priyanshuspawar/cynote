// "use client";

// import React, {
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import {
//   Smile,
//   Image as ImageIcon,
//   MessageCircle,
//   XCircle,
//   Inbox,
// } from "lucide-react";
// import Image from "next/image";
// import EmojiPicker from "../global/emojiPicker";
// import { cn } from "@/lib/utils";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { toast } from "sonner";
// import { File as AppFile } from "@/lib/supabase/supabase.types";
// import { updateFile } from "@/lib/supabase/queries";
// import { useAppState } from "@/lib/providers/state-provider";
// import debounce from "lodash/debounce";
// import { SuggestedImages } from "@/lib/constants";
// import DragImagePosition from "./drag-image-reposition";
// import { createClient } from "@/lib/supabase/helpers/client";

// const HeaderOption = () => {
//   const supabase = createClient();
//   const { dispatch, workspaceId, folderId, state } = useAppState();
//   const { fileId: foldernFile } = useAppState();
//   const fileId = foldernFile ? foldernFile.split("folder")[1] : null;
//   const [position, setPosition] = useState<{ x: number; y: number }>();
//   const [isDragable, setIsDragable] = useState(false);

//   const [banner, setBanner] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [fileDetails, setFileDetails] = useState<AppFile | null>(null);

//   // Debounced function to avoid multiple quick updates to the database
//   const debouncedUpdateBannerUrl = useMemo(
//     () => debounce(async (url: string) => updateBannerUrlToDb(url), 300),
//     [fileId]
//   );

//   const handleBannerChange = useCallback(
//     (url: string | null) => {
//       setBanner(url);
//       debouncedUpdateBannerUrl(url || "");
//     },
//     [debouncedUpdateBannerUrl]
//   );

//   const uploadCustomBanner = async (file: File): Promise<string> => {
//     try {
//       const { data } = await supabase.storage
//         .from("banners")
//         .upload(`custom-banner-${fileId}`, file, {
//           cacheControl: "3600",
//           upsert: true,
//         });

//       if (!data?.path) throw new Error("Failed to upload image");

//       const {
//         data: { publicUrl },
//       } = supabase.storage.from("banners").getPublicUrl(data.path);
//       return publicUrl;
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Something went wrong uploading";
//       toast.error(`Failed to upload file: ${errorMessage}`);
//       return "";
//     }
//   };

//   const handleFileUpload = async () => {
//     if (selectedFile) {
//       const customUrl = await uploadCustomBanner(selectedFile);
//       handleBannerChange(customUrl);
//     }
//   };

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   const updateBannerUrlToDb = async (bannerUrl: string) => {
//     if (!fileId) return;
//     const updateData: Partial<AppFile> = { bannerUrl };

//     try {
//       const { error } = await updateFile(updateData, fileId);
//       if (error) throw error;
//       toast.success("Banner updated successfully");
//     } catch (error) {
//       toast.error("Error updating banner");
//       setBanner(null);
//     }
//   };

//   const updateIconId = async (iconId: string) => {
//     if (!fileId || !workspaceId || !folderId) return;
//     const updateData: Partial<AppFile> = { iconId };
//     dispatch({
//       type: "UPDATE_FILE",
//       payload: { file: updateData, fileId, workspaceId, folderId },
//     });
//     try {
//       const { error } = await updateFile(updateData, fileId);
//       if (error) throw error;
//       toast.success("Icon updated successfully");
//     } catch (error) {
//       toast.error("Error updating icon");
//     }
//   };

//   useEffect(() => {
//     if (!fileId) return;
//     const data = state.workspaces
//       .find((workspace) => workspace.id == workspaceId)
//       ?.folders.find((folder) => folder.id == folderId)
//       ?.files.find((file) => file.id == fileId);
//     if (!data) return;
//     setFileDetails(data);
//     setBanner(data.bannerUrl);
//     // console.log("@@sa",data)
//   }, [fileId]);
//   // WIP be optimistic for all the file upations

//   const [isTitleEditing, setIsTitleEditing] = useState(false);
//   const [tempTitle, setTempTitle] = useState(fileDetails?.title);
//   const handleDoubleClick = () => {
//     setIsTitleEditing(true);
//   };
//   const handleTitleBlur = async () => {
//     setIsTitleEditing(false);
//     if (!fileId || !workspaceId || !folderId) return;
//     dispatch({
//       type: "UPDATE_FILE",
//       payload: {
//         file: {
//           title: tempTitle ?? "Undefined",
//         },
//         fileId,
//         workspaceId,
//         folderId,
//       },
//     });

//     let updatedFileData: Partial<AppFile> = {
//       title: tempTitle,
//     };
//     await updateFile(updatedFileData, fileId);
//   };

//   if (!fileDetails) return <></>;

//   return (
//     <div className="w-full flex flex-col">
//       <div className="w-full min-h-[20vh] group/parent flex flex-col items-center justify-end">
//         {/* Banner */}
//         {banner && (
//           <div className="relative w-full h-fit group mb-8">
//             {/* image */}
//             <DragImagePosition
//               fileId={fileDetails.id}
//               isDragable={isDragable}
//               url={banner}
//               onChangePosition={setPosition}
//             />
//             <div className="opacity-0 absolute bg-Neutrals/neutrals-10 bottom-10 right-10 group-hover:opacity-100 flex text-xs py-1 px-2 rounded-md gap-1 transition-all duration-500 cursor-pointer ease-in-out">
//               <Popover>
//                 <PopoverTrigger>
//                   <span className="hover:text-washed-purple-500">
//                     Change Banner
//                   </span>
//                 </PopoverTrigger>
//                 <PopoverContent className="flex flex-col w-96 px-3 py-2 bg-brand-dark">
//                   <span className="text-sm text-neutral-200">Banners</span>
//                   <div className="grid grid-cols-4 gap-2 my-2">
//                     {SuggestedImages.map((banner) => (
//                       <div
//                         key={banner.id}
//                         onClick={() => handleBannerChange(banner.imgUrl)}
//                         className="relative cursor-pointer aspect-square"
//                       >
//                         <Image
//                           src={banner.imgUrl}
//                           fill
//                           alt={`Banner ${banner.id}`}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       onClick={() => inputRef.current?.click()}
//                       className="bg-transparent text-sm hover:text-neutral-400 cursor-pointer transition-colors duration-500 text-neutral-600 flex gap-2 items-center h-fit"
//                       aria-label="Upload a new banner"
//                     >
//                       <Inbox className="w-4" />
//                       <input
//                         ref={inputRef}
//                         id="bannerUpload"
//                         type="file"
//                         className="hidden"
//                         onChange={handleFileSelect}
//                       />
//                       <label className="leading-none">
//                         {selectedFile ? selectedFile.name : "Upload"}
//                       </label>
//                     </div>
//                     {selectedFile && (
//                       <button
//                         onClick={handleFileUpload}
//                         className="mt-2 text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
//                       >
//                         Upload
//                       </button>
//                     )}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//               {"|"}
//               <span
//                 onClick={() => {
//                   if (isDragable) {
//                     console.log(position);
//                     window.localStorage.setItem(
//                       fileDetails.id,
//                       JSON.stringify(position)
//                     );
//                   }
//                   setIsDragable(!isDragable);
//                 }}
//                 className="hover:text-washed-purple-500"
//               >
//                 {isDragable ? "Save Position" : "Reposition"}
//               </span>
//             </div>
//           </div>
//         )}

//         <Options
//           onChangeBanner={handleBannerChange}
//           emoji={fileDetails.iconId}
//           updateIcon={updateIconId}
//           banner={banner}
//         />
//         <div
//           onDoubleClick={handleDoubleClick}
//           className="my-4 flex justify-start w-4/6"
//         >
//           <input
//             onBlur={handleTitleBlur}
//             value={tempTitle ?? fileDetails.title}
//             className="text-3xl select-none font-semibold tracking-wide focus:outline-none bg-transparent"
//             readOnly={!isTitleEditing}
//             onChange={(e) => setTempTitle(e.target.value)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeaderOption;

// // Options Component
// const Options = ({
//   onChangeBanner,
//   emoji: initialEmoji,
//   updateIcon,
//   banner,
// }: {
//   onChangeBanner: (data: string | null) => void;
//   emoji: string;
//   updateIcon: (iconId: string) => void;
//   banner: string | null;
// }) => {
//   const [emoji, setEmoji] = useState<string>(initialEmoji);

//   const handleBannerAction = () => {
//     if (banner) {
//       onChangeBanner(null); // Remove banner if already set
//     } else {
//       const firstBanner = SuggestedImages[0];
//       onChangeBanner(firstBanner.imgUrl); // Add first banner from suggestions if not set
//     }
//   };

//   return (
//     <div className="w-4/6 flex items-start relative">
//       <div className="w-fit gap-2 grid grid-cols-3 group/options transition-all transform duration-300 ease-in">
//         {/* Icon */}
//         <div className={cn("relative", { "col-span-full": emoji !== "" })}>
//           <EmojiPicker
//             getValue={(s) => {
//               setEmoji(s);
//               updateIcon(s);
//             }}
//           >
//             <div className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg relative">
//               {emoji && (
//                 <XCircle
//                   onClick={() => setEmoji("📄")}
//                   className="hidden group-hover:block absolute top-0 right-0.5 w-3 text-washed-purple-800"
//                 />
//               )}
//               {emoji ? (
//                 <span className="text-5xl">{emoji}</span>
//               ) : (
//                 <>
//                   <Smile className="w-4 h-4" />
//                   <span className="leading-none">Add icon</span>
//                 </>
//               )}
//             </div>
//           </EmojiPicker>
//         </div>

//         {/* Add/Remove Banner */}
//         <div
//           onClick={handleBannerAction}
//           className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg"
//         >
//           <ImageIcon className="w-4 h-4" />
//           <span className="leading-none">
//             {banner ? "Remove cover" : "Add cover"}
//           </span>
//         </div>

//         {/* Add Comment */}
//         <div className="flex text-washed-purple-700 hover:text-washed-purple-600 transition-colors cursor-pointer duration-500 ease-in-out items-center gap-2 text-sm p-2 group hover:bg-neutral-300/10 rounded-lg">
//           <MessageCircle className="w-4 h-4" />
//           <span className="leading-none">Add comment</span>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";

const HeaderOptions = () => {
  return <div>HeaderOptions</div>;
};

export default HeaderOptions;
