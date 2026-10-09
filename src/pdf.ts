export async function extractPdfText(file: File): Promise<string> {
  const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  GlobalWorkerOptions.workerSrc = worker.default
  const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
  try {
    const document = await task.promise
    const pages: string[] = []
    for (let index = 1; index <= document.numPages; index++) {
      const page = await document.getPage(index)
      const content = await page.getTextContent()
      const text = content.items.map((item) => 'str' in item ? `${item.str}${item.hasEOL ? '\n' : ' '}` : '').join('')
      pages.push(text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim())
    }
    return pages.filter(Boolean).join('\n')
  } finally {
    await task.destroy()
  }
}
