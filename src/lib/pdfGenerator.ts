import { jsPDF } from 'jspdf'
import { ComplianceItem } from './complianceData'

interface ReportData {
  id?: string
  propertyAddress?: string
  propertyCity?: string
  propertyState?: string
  zip?: string
  overallScore: number
  status: 'compliant' | 'partial' | 'non_compliant'
  issues: Array<{
    type: 'violation' | 'warning'
    message: string
    severity: 'high' | 'medium' | 'low'
  }>
  recommendations: string[]
  compliantItems: string[]
  timestamp?: string
  images?: string[] // Base64 images
  annotatedImages?: string[] // Images with annotations
}

// Generate PDF report with compliance results
export function generateComplianceReport(data: ReportData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  doc.setFillColor(6, 78, 59) // Emerald-700
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Zone Zero Navigator', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Wildfire Compliance Report', 20, 30)
  
  // Date
  const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : new Date().toLocaleDateString()
  doc.text(`Generated: ${date}`, pageWidth - 60, 30)

  yPos = 55

  // Property Address
  if (data.propertyAddress) {
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Property Address', 20, yPos)
    yPos += 8
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const fullAddress = [data.propertyAddress, data.propertyCity, data.propertyState, data.zip]
      .filter(Boolean)
      .join(', ')
    doc.text(fullAddress || 'Not provided', 20, yPos)
    yPos += 15
  }

  // Compliance Score
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Compliance Score', 20, yPos)
  yPos += 10

  // Score circle
  const score = data.overallScore
  if (score >= 70) {
    doc.setFillColor(22, 163, 74) // green
  } else if (score >= 50) {
    doc.setFillColor(234, 179, 8) // yellow
  } else {
    doc.setFillColor(220, 38, 38) // red
  }
  doc.circle(35, yPos, 15, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(String(data.overallScore), 35, yPos + 2, { align: 'center' })

  // Status
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  const statusText = data.status === 'compliant' ? 'COMPLIANT' : 
                    data.status === 'partial' ? 'PARTIAL COMPLIANCE' : 'NON-COMPLIANT'
  doc.text(statusText, 60, yPos - 2)
  
  yPos += 20

  // Violations
  if (data.issues && data.issues.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('Issues Found', 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    data.issues.forEach((issue, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      
      const prefix = issue.severity === 'high' ? '🔴' : '🟡'
      const line = `${prefix} ${issue.message} (${issue.severity.toUpperCase()})`
      
      // Wrap text
      const lines = doc.splitTextToSize(line, pageWidth - 40)
      doc.text(lines, 20, yPos)
      yPos += lines.length * 5 + 3
    })
    
    yPos += 10
  }

  // Compliant Items
  if (data.compliantItems && data.compliantItems.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(22, 163, 74)
    doc.text('Compliant Items', 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    data.compliantItems.forEach(item => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`✓ ${item}`, 20, yPos)
      yPos += 6
    })
    
    yPos += 10
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Recommended Actions', 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    data.recommendations.forEach((rec, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40)
      doc.text(lines, 20, yPos)
      yPos += lines.length * 5 + 3
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Zone Zero Navigator - California Defensible Space Compliance Report - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  return doc
}

// Download PDF
export function downloadReport(data: ReportData, filename = 'compliance-report'): void {
  const doc = generateComplianceReport(data)
  doc.save(`${filename}.pdf`)
}

// Generate report with images (if available)
export async function generateReportWithImages(
  data: ReportData,
  onProgress?: (step: string) => void
): Promise<Blob> {
  onProgress?.('Generating PDF...')
  
  // For images, we'd need to add them to the PDF
  // This is a simplified version
  const doc = generateComplianceReport(data)
  
  // Add images if available
  if (data.images && data.images.length > 0) {
    let yPos = 50
    
    doc.addPage()
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Property Photos', 20, yPos)
    yPos += 10
    
    for (let i = 0; i < Math.min(data.images.length, 4); i++) {
      try {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        
        // Add image (scaled to fit)
        const imgWidth = 80
        const imgHeight = 60
        
        doc.addImage(data.images[i], 'JPEG', 20, yPos, imgWidth, imgHeight)
        yPos += imgHeight + 10
      } catch (e) {
        console.error('Failed to add image:', e)
      }
    }
  }
  
  return doc.output('blob')
}
