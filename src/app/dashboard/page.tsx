'use client'

import { useState, useRef } from 'react'
import { 
  Shield, Upload, Camera, FileText, CheckCircle, AlertTriangle, 
  Home, Menu, X, ChevronRight, ArrowLeft, Trash2, Download, Share2
} from 'lucide-react'
import Link from 'next/link'

// Dashboard Page
export default function DashboardPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [report, setReport] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotos(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const analyzePhotos = async () => {
    if (photos.length === 0) return
    
    setAnalyzing(true)
    
    // Simulate AI analysis - in production this calls the API
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setReport({
      score: 72,
      status: 'partial',
      issues: [
        { type: 'violation', message: 'Mulch within 5ft of structure', severity: 'high' },
        { type: 'warning', message: 'Dead vegetation near fence', severity: 'medium' },
      ],
      recommendations: [
        'Remove all combustible materials from 5ft zone',
        'Replace wood mulch with gravel within 5ft',
        'Trim dead branches within 10ft of structure',
      ],
      compliantItems: [
        'No dead trees near structure',
        'Clear gutters',
        'No storage against exterior wall',
      ]
    })
    
    setAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-white hover:text-emerald-400 transition">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Free Plan</span>
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!report ? (
          <>
            {/* Photo Upload Section */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Scan Your Property</h1>
              <p className="text-slate-400 mb-6">
                Upload photos of vegetation and objects within 5 feet of your home
              </p>

              {/* Photo Grid */}
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={photo} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition mb-6"
                >
                  <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-white mb-2">Click to upload or drag and drop</p>
                  <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border border-white/20 text-white py-3 rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Add More Photos
                </button>
                <button
                  onClick={analyzePhotos}
                  disabled={photos.length === 0 || analyzing}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Analyze Compliance
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-400 mb-2">📸 Tips for best results</h3>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Take photos from all four sides of your home</li>
                <li>• Include photos of vegetation touching or near walls</li>
                <li>• Show any mulch, woodpiles, or storage within 5ft</li>
                <li>• Include gutters and roof edges</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Compliance Report</h1>
                <div className="flex gap-2">
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-6 mb-8">
                <div className={`text-5xl font-bold ${report.score >= 70 ? 'text-emerald-400' : report.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {report.score}
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">
                    {report.status === 'compliant' ? 'COMPLIANT' : report.status === 'partial' ? 'PARTIAL COMPLIANCE' : 'NON-COMPLIANT'}
                  </div>
                  <div className="text-slate-400">Compliance Score</div>
                </div>
              </div>

              {/* Issues */}
              {report.issues.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Issues Found
                  </h3>
                  <div className="space-y-2">
                    {report.issues.map((issue: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg flex items-start gap-3 ${
                        issue.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${issue.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                        <span className="text-white">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliant Items */}
              {report.compliantItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Compliant Items
                  </h3>
                  <div className="space-y-2">
                    {report.compliantItems.map((item: string, i: number) => (
                      <div key={i} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-white mb-3">Recommended Actions</h3>
                <div className="space-y-2">
                  {report.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="p-3 bg-slate-700/50 rounded-lg text-slate-300">
                      {i + 1}. {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => { setReport(null); setPhotos([]) }}
              className="w-full border border-white/20 text-white py-3 rounded-lg hover:bg-white/10 transition"
            >
              Start New Scan
            </button>
          </>
        )}
      </main>
    </div>
  )
}
