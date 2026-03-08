export async function generatePdf(element: HTMLElement, filename: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html2pdf = (await import('html2pdf.js' as any)).default

  const opt = {
    margin: [20, 15, 20, 15] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'png' as const, quality: 1.0 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  }

  await html2pdf().set(opt).from(element).save()
}
