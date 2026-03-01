
"use client"

import * as React from "react"

interface WindowDrawingProps {
  width: number
  height: number
  type: 'Fixed' | 'Sliding'
  className?: string
}

export function WindowDrawing({ width, height, type, className }: WindowDrawingProps) {
  // Base dimensions for SVG
  const padding = 40
  const baseWidth = 200
  
  // Robustness check for invalid dimensions
  const safeWidth = Number.isNaN(Number(width)) || width <= 0 ? 1 : width;
  const safeHeight = Number.isNaN(Number(height)) || height <= 0 ? 1 : height;
  
  const svgWidth = baseWidth
  const svgHeight = (safeHeight / safeWidth) * svgWidth
  
  // Constrain height if it's too tall for a single card
  const finalSvgHeight = Math.min(Math.max(svgHeight, 150), 300)
  const finalSvgWidth = (safeWidth / safeHeight) * finalSvgHeight

  const strokeWidth = 2
  const innerOffset = 8

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={finalSvgWidth + padding * 2}
        height={finalSvgHeight + padding * 2}
        viewBox={`0 0 ${finalSvgWidth + padding * 2} ${finalSvgHeight + padding * 2}`}
        className="bg-white border rounded shadow-sm"
      >
        {/* Dimension Lines - Width */}
        <line x1={padding} y1={padding - 10} x2={padding + finalSvgWidth} y2={padding - 10} stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
        <text x={padding + finalSvgWidth / 2} y={padding - 15} textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">
          {width || 0} ft
        </text>

        {/* Dimension Lines - Height */}
        <line x1={padding + finalSvgWidth + 10} y1={padding} x2={padding + finalSvgWidth + 10} y2={padding + finalSvgHeight} stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
        <text 
          x={padding + finalSvgWidth + 25} 
          y={padding + finalSvgHeight / 2} 
          textAnchor="middle" 
          fontSize="10" 
          fill="#333" 
          fontWeight="bold"
          transform={`rotate(90, ${padding + finalSvgWidth + 25}, ${padding + finalSvgHeight / 2})`}
        >
          {height || 0} ft
        </text>

        {/* Outer Frame */}
        <rect
          x={padding}
          y={padding}
          width={finalSvgWidth}
          height={finalSvgHeight}
          fill="none"
          stroke="#333"
          strokeWidth={strokeWidth}
        />
        
        {/* Miter lines (corners) */}
        <line x1={padding} y1={padding} x2={padding + innerOffset} y2={padding + innerOffset} stroke="#333" strokeWidth="1" />
        <line x1={padding + finalSvgWidth} y1={padding} x2={padding + finalSvgWidth - innerOffset} y2={padding + innerOffset} stroke="#333" strokeWidth="1" />
        <line x1={padding} y1={padding + finalSvgHeight} x2={padding + innerOffset} y2={padding + finalSvgHeight - innerOffset} stroke="#333" strokeWidth="1" />
        <line x1={padding + finalSvgWidth} y1={padding + finalSvgHeight} x2={padding + finalSvgWidth - innerOffset} y2={padding + finalSvgHeight - innerOffset} stroke="#333" strokeWidth="1" />

        {/* Inner Frame */}
        <rect
          x={padding + innerOffset}
          y={padding + innerOffset}
          width={finalSvgWidth - innerOffset * 2}
          height={finalSvgHeight - innerOffset * 2}
          fill="#f8fafc"
          stroke="#333"
          strokeWidth={1}
        />

        {/* Mid-rail for sliding windows */}
        {type === 'Sliding' && (
           <line 
            x1={padding + finalSvgWidth / 2} 
            y1={padding} 
            x2={padding + finalSvgWidth / 2} 
            y2={padding + finalSvgHeight} 
            stroke="#333" 
            strokeWidth={2} 
          />
        )}
        
        {/* Glass Reflection Lines */}
        <line x1={padding + 20} y1={padding + 40} x2={padding + 40} y2={padding + 20} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={padding + 25} y1={padding + 45} x2={padding + 45} y2={padding + 25} stroke="#cbd5e1" strokeWidth="1" />
      </svg>
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{type} Window Drawing</span>
    </div>
  )
}
