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
            "flex items-center justify-center rounded-lg px-6 py-2 text-xs font-medium shadow-sm border",
            type === "start"
              ? "bg-primary/10 text-primary border-border"
              : "bg-muted text-muted-foreground border-border"
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
