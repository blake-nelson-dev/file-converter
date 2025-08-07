import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import pdfParse from 'pdf-parse'; // Default import as pdf-parse exports a function
import { ConversionResult } from '../types/conversion.types';

/**
 * Converts a PDF buffer to DOCX format
 * 
 * This function handles the core conversion logic:
 * 1. Extracts text content using pdf-parse for accurate text extraction
 * 2. Creates a Word document with proper formatting
 * 3. Preserves page breaks and basic structure
 * 4. Returns the converted document as a buffer
 * 
 * @param pdfBuffer - Buffer containing the PDF file data
 * @returns ConversionResult with success status, buffer, and processing time
 */
export async function convertPdfToDocx(pdfBuffer: Buffer): Promise<ConversionResult & { buffer?: Buffer }> {
  const startTime = Date.now();
  
  try {
    // Use pdf-parse to extract text from the entire PDF
    const pdfData = await pdfParse(pdfBuffer);
    
    // Also load with pdf-lib to get page dimensions
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    // Get first page dimensions as reference (assuming uniform page size)
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Split the extracted text by pages (pdf-parse provides this)
    const pageTexts = pdfData.text.split('\n\n\n'); // pdf-parse typically uses triple newlines between pages
    
    // Array to hold document sections
    const sections = [];
    
    // Process each page of text
    for (let pageIndex = 0; pageIndex < Math.min(pageTexts.length, pages.length); pageIndex++) {
      const pageText = pageTexts[pageIndex] || '';
      
      // Array to hold paragraphs for this page
      const children: Paragraph[] = [];
      
      // Add page break for pages after the first
      if (pageIndex > 0) {
        children.push(
          new Paragraph({
            text: '',
            pageBreakBefore: true,
          })
        );
      }
      
      // Convert extracted text to paragraphs
      const lines = pageText.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          // Detect potential headings (lines that are all caps or shorter lines)
          const isHeading = line.length < 50 && line === line.toUpperCase();
          
          if (isHeading) {
            // Format as heading - centered for better visual hierarchy
            children.push(
              new Paragraph({
                text: line.trim(),
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER, // Center headings for better formatting
                spacing: {
                  before: 240, // 12pt before
                  after: 120,  // 6pt after
                },
              })
            );
          } else {
            // Regular paragraph
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24, // Size in half-points (24 = 12pt)
                  })
                ],
                spacing: {
                  after: 120, // 6pt after each paragraph
                },
              })
            );
          }
        } else {
          // Preserve empty lines for spacing
          children.push(new Paragraph({ text: '' }));
        }
      }
      
      // Create a section for this page with matching dimensions
      sections.push({
        properties: {
          page: {
            size: {
              // Convert points to twips (1 point = 20 twips)
              width: Math.round(width * 20),
              height: Math.round(height * 20),
            },
            margins: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
            },
          },
        },
        children: children.length > 0 ? children : [new Paragraph({ text: '' })], // Ensure at least one paragraph
      });
    }
    
    // If no sections were created, create at least one
    if (sections.length === 0) {
      sections.push({
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'No text content could be extracted from this PDF.',
                italics: true, // Italics is a property of TextRun, not Paragraph
              })
            ],
            alignment: AlignmentType.CENTER,
          })
        ],
      });
    }
    
    // Create the Word document with all sections
    const doc = new Document({
      sections,
      creator: 'ConvertStudio',
      description: 'Converted from PDF using ConvertStudio',
      title: pdfData.info?.Title || 'Converted Document',
    });
    
    // Convert document to buffer
    const docBuffer = await Packer.toBuffer(doc);
    
    return {
      success: true,
      buffer: docBuffer,
      convertedPath: undefined, // Path will be set by the calling function
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('PDF to DOCX conversion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown conversion error',
      processingTime: Date.now() - startTime,
    };
  }
}

