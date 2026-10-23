import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const MAX_PAGE_WIDTH = 800
const SIDE_GUTTER = 16

function App() {
  const [numPages, setNumPages] = useState<number>()
  const [pageWidth, setPageWidth] = useState(MAX_PAGE_WIDTH)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - SIDE_GUTTER * 2
      setPageWidth(Math.min(MAX_PAGE_WIDTH, available))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pdf" ref={containerRef}>
      <Document
        file="/resume.pdf"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF</p>}
      >
        {Array.from({ length: numPages ?? 0 }, (_, i) => (
          <Page key={i} pageNumber={i + 1} width={pageWidth} />
        ))}
      </Document>
      <a
        className="download-button"
        href="/resume.pdf"
        download="Sam_Grobelny_Resume.pdf"
      >
        Download Resume
      </a>
    </section>
  )
}

export default App
