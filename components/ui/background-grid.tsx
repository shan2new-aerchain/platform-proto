import { cn } from "@/lib/utils"

export function BackgroundGrid({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]",
          "dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]",
          className
        )}
      />
    </div>
  )
}

export function BackgroundDots({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]",
          "dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
          className
        )}
      />
    </div>
  )
}
