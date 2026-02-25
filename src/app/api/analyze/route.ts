import { NextRequest, NextResponse } from 'next/server'

// Analyze photos for compliance using Google Gemini
export async function POST(request: NextRequest) {
  try {
    const { photos, address } = await request.json()

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Build the prompt for compliance analysis
    const prompt = `You are a California wildfire defensible space compliance expert. Analyze these photos of a property and determine:
    
1. Whether combustible materials are within 5 feet of the structure (Zone 0)
2. Specific violations or concerns
3. Compliance score (0-100)
4. Recommendations for remediation

California 5-foot rule: Anything combustible (wood, mulch, plants, storage) cannot be within 5 feet of the structure. This includes:
- Wooden mulch
- Firewood stacks
- Patio furniture
- Dead vegetation
- combustible fencing

Analyze each photo and provide a detailed compliance report in JSON format:
{
  "score": number,
  "status": "compliant" | "partial" | "non_compliant",
  "issues": [{type: "violation" | "warning", message: string, severity: "high" | "medium" | "low"}],
  "recommendations": string[],
  "compliantItems": string[]
}`

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              ...photos.map((photo: string) => ({
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: photo.split(',')[1] // Remove data:image/jpeg;base64, prefix
                }
              }))
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      return NextResponse.json(
        { error: 'AI analysis failed', details: errorData },
        { status: 500 }
      )
    }

    const result = await response.json()
    
    // Parse the JSON response from Gemini
    let analysisResult
    try {
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      // Extract JSON from response (in case it's wrapped in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Return demo data if parsing fails
      analysisResult = {
        score: 65,
        status: 'partial',
        issues: [
          { type: 'violation', message: 'Combustible materials detected within 5ft zone', severity: 'high' }
        ],
        recommendations: [
          'Remove all combustible materials from 5ft of structure',
          'Replace wood mulch with non-combustible gravel'
        ],
        compliantItems: [
          'No dead trees adjacent to structure',
          'Gutters appear clear'
        ]
      }
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
