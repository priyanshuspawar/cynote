"use client";
import { workspace } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import SelectedWorkspace from "./selectedWorkspace";
import CustomDialogTrigger from "../global/customDialogTrigger";
import WorkspaceCreator from "../global/workspace-creator";

type WorkspaceDropDownProps = {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  colaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
};

const WorkspaceDropdown = ({
  privateWorkspaces,
  colaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}: WorkspaceDropDownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: workspace) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const workspaces = [
    ...privateWorkspaces,
    ...colaboratingWorkspaces,
    ...sharedWorkspaces,
  ];
  useEffect(() => {
    const findSelectedWorkspace = workspaces.find(
      (workspace) => workspace.id === defaultValue?.id
    );
    if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace);
  }, [defaultValue]);

  return (
    <div
      className=" relative inline-block
    text-left
"
    >
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            "Select a workspace"
          )}
        </span>
      </div>
      {isOpen && (
        <div
          className="origin-top-right
        absolute
        w-full
        rounded-md
        shadow-md
        z-50
        h-[190px]
        bg-black/10
        backdrop-blur-lg
        group
        overflow-x-hidden
        overflow-y-auto
        border-[1px]
        border-muted
    "
        >
          <div className="rounded-md flex flex-col">
            <div className="!p-2">
              {!!privateWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Private</p>
                  <hr></hr>
                  {privateWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!sharedWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Shared</p>
                  <hr />
                  {sharedWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!colaboratingWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Collaborating</p>
                  <hr />
                  {colaboratingWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
            </div>
            <CustomDialogTrigger
              header="Create A Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
            >
              <div
                className="flex
            transition-all
            hover:bg-muted
            justify-center
            items-center
            gap-2
            p-2
            w-full"
              >
                <article
                  className="text-slate-500
              rounded-full
               bg-slate-800
               w-4
               h-4
               flex
               items-center
               justify-center"
                >
                  +
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
