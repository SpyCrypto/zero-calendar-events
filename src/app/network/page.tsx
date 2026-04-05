'use client'
import { useAppStore } from '@/lib/store'
import { useEffect, useRef, useState } from 'react'
import { MOCK_NETWORK_NODES, MOCK_NETWORK_EDGES } from '@/lib/mock-data'
import { NetworkNode } from '@/lib/types'
import { Users, Zap } from 'lucide-react'

export default function NetworkPage() {
  const { wallet } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [selected, setSelected] = useState<NetworkNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement!.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.max(400, rect.width * 0.55) })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    drawGraph()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions])

  const drawGraph = () => {
    const svg = svgRef.current!
    svg.innerHTML = ''
    const { width, height } = dimensions
    const cx = width / 2, cy = height / 2
    const radius = Math.min(width, height) * 0.35

    // Position nodes in circle layout
    const positions: Record<string, { x: number; y: number }> = {}
    MOCK_NETWORK_NODES.forEach((node, i) => {
      if (i === 0) { positions[node.id] = { x: cx, y: cy } }
      else {
        const angle = ((i - 1) / (MOCK_NETWORK_NODES.length - 1)) * 2 * Math.PI
        positions[node.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
      }
    })

    // Draw edges
    MOCK_NETWORK_EDGES.forEach(edge => {
      const s = positions[edge.source], t = positions[edge.target]
      if (!s || !t) return
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', String(s.x)); line.setAttribute('y1', String(s.y))
      line.setAttribute('x2', String(t.x)); line.setAttribute('y2', String(t.y))
      line.setAttribute('stroke', `rgba(100,103,244,${0.1 + edge.weight * 0.08})`)
      line.setAttribute('stroke-width', String(Math.min(edge.weight, 4)))
      svg.appendChild(line)
    })

    // Draw nodes
    MOCK_NETWORK_NODES.forEach(node => {
      const pos = positions[node.id]
      const isCenter = node.id === 'n1'
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.style.cursor = 'pointer'
      g.addEventListener('click', () => setSelected(node))

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', String(pos.x)); circle.setAttribute('cy', String(pos.y))
      circle.setAttribute('r', isCenter ? '28' : '20')
      circle.setAttribute('fill', isCenter ? '#6467f4' : '#1e1b4b')
      circle.setAttribute('stroke', isCenter ? '#00d4ff' : '#6467f4')
      circle.setAttribute('stroke-width', isCenter ? '3' : '1.5')

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', String(pos.x)); label.setAttribute('y', String(pos.y + (isCenter ? 44 : 36)))
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('fill', '#94a3b8'); label.setAttribute('font-size', '11')
      label.textContent = node.displayName

      g.appendChild(circle); g.appendChild(label)
      svg.appendChild(g)
    })
  }

  void wallet

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Networking Graph</h1>
        <p className="text-slate-500 mt-1">Discover connections through shared event attendance</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 card-glass rounded-2xl p-4 overflow-hidden">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full" />
        </div>
        <div className="space-y-4">
          <div className="card-glass rounded-xl p-4">
            <h3 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-midnight-400" /> Attendees
            </h3>
            <div className="space-y-2">
              {MOCK_NETWORK_NODES.slice(1).map(node => (
                <button key={node.id} onClick={() => setSelected(node)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected?.id === node.id ? 'bg-midnight-700 text-slate-200' : 'hover:bg-midnight-900 text-slate-500'}`}>
                  <div className="font-medium">{node.displayName}</div>
                  <div className="text-xs text-midnight-400">{node.eventsInCommon} events in common</div>
                </button>
              ))}
            </div>
          </div>
          {selected && (
            <div className="card-glass rounded-xl p-4">
              <h3 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> {selected.displayName}
              </h3>
              <p className="text-xs text-slate-500 font-mono mb-2">{selected.address}</p>
              <p className="text-sm text-slate-400">{selected.eventsInCommon} events in common</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
