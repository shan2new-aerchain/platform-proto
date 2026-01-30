"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface AddNodeButtonProps {
  data: {
    onAdd: () => void
  }
}

export const AddNodeButton = memo(function AddNodeButton({ data }: AddNodeButtonProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="bg-transparent! border-0! w-0! h-0!" />
      <div className="w-[200px] flex items-center justify-center">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            data.onAdd()
          }}
          aria-label="Add step"
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
        </Button>
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-transparent! border-0! w-0! h-0!" />
    </>
  )
})
