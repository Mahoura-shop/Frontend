"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  autoSort?: boolean; // Optional prop to enable/disable auto-sorting
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, onValueChange, autoSort = true, ...props }, ref) => {
  const handleValueChange = (values: number[]) => {
    if (autoSort && values.length > 1) {
      // Ensure the values are always sorted in ascending order
      const sortedValues = [...values].sort((a, b) => a -b);
      
      if (onValueChange) {
        onValueChange(sortedValues);
      }
    } else {
      if (onValueChange) {
        onValueChange(values);
      }
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary-rose via-accent-gold to-secondary-plum" />
      </SliderPrimitive.Track>
      {(props.value || props.defaultValue)?.map((_, index) => (
        <SliderPrimitive.Thumb 
          key={index}
          className="block h-5 w-5 rounded-full border-2 border-primary-rose bg-background shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing" 
        />
      ))}
    </SliderPrimitive.Root>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }