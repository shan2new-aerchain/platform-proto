"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ReactFlowProvider } from "@xyflow/react"
import { SiteHeader } from "@/components/site-header"
import { PipelineCanvas } from "@/components/pipeline/pipeline-canvas"
import { procureToPayPipeline } from "@/lib/mock-data"

export default function ProcureToPayPipelinePage() {
  const router = useRouter()
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null)

  const handleStageClick = (stageId: string) => {
    // Navigate to the stage detail page
    router.push(`/procure-to-pay/stages/${stageId}`)
  }

  return (
    <div className="flex h-screen flex-col">
      <SiteHeader
        title={procureToPayPipeline.name}
        breadcrumbs={[{ label: "Workflows", href: "/" }]}
      />

      <div className="relative flex-1">
        <ReactFlowProvider>
          <PipelineCanvas
            pipeline={procureToPayPipeline}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
            onStageClick={handleStageClick}
            initialZoom={1}
          />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
