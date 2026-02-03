"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { cn } from "@/lib/utils"

interface StartEndNodeProps {
  data: {
    type: "start" | "end"
  }
}

export const StartEndNode = memo(function StartEndNode({ data }: StartEndNodeProps) {
  const { type } = data

  return (
    <>
      {type === "end" && (
        <Handle type="target" position={Position.Top} className="bg-transparent! border-0! w-0! h-0!" />
      )}
      <div className="w-[200px] flex items-center justify-center">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg px-4 py-1.5 border text-[0.625rem] font-medium leading-none",
            type === "start"
              ? "bg-primary/8 text-primary/90 border-primary/20"
              : "bg-muted/80 text-muted-foreground border-border"
          )}
        >
          {type === "start" ? "Start" : "End"}
        </div>
      </div>
      {type === "start" && (
        <Handle type="source" position={Position.Bottom} className="bg-transparent! border-0! w-0! h-0!" />
      )}
    </>
  )
})
