'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Shield, Camera, Loader2, ChevronLeft, ChevronRight, Check,
  MapPin, Building2, Home, ArrowRight, X, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Photo slots configuration
const PHOTO_SLOTS = [
  { id: 'front', label: 'Front', placeholder: 'Capture front perspective' },
  { id: 'rear', label: 'Rear', placeholder: 'Capture rear perspective' },
  { id: 'left', label: 'Left Side', placeholder: 'Capture left side' },
  { id: 'right', label: 'Right Side', placeholder: 'Capture right side' },
]

// Jurisdictions
const JURISDICTIONS = [
  { id: 'san_diego', name: 'San Diego', code: 'LRA', description: 'San Diego County Fire Code' },
  { id: 'california', name: 'California', code: 'SRA', description: 'State Fire Responsibility Area' },
]

interface PhotoSlot {
  id: string
  data?: string // base64
  label: string
}

export default function AuditScannerPage() {
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'jurisdiction' | 'capture' | 'review' | 'analyzing'>('address')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [currentSlot, setCurrentSlot] = useState(0)
  const [cameraActive, setCameraActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize photo slots
  useEffect(() => {
    setPhotos(PHOTO_SLOTS.map(s => ({ id: s.id, label: s.label })))
  }, [])

  // Camera functions
  const startCamera = async (slotId: string) => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
      setCurrentSlot(PHOTO_SLOTS.findIndex(s => s.id === slotId))
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please use file upload instead.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(videoRef.current, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.8)
    
    // Compress to max 1024px
    const compressed = compressImage(base64, 1024)
    
    setPhotos(prev => prev.map((p, i) => 
      i === currentSlot ? { ...p, data: compressed } : p
    ))
    
    stopCamera()
  }

  const compressImage = (base64: string, maxWidth: number): string => {
    const img = new Image()
    img.src = base64
    
    const canvas = document.createElement('canvas')
    const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
    canvas.width = img.width * ratio
    canvas.height = img.height * ratio
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return base64
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const compressed = compressImage(ev.target.result as string, 1024)
        setPhotos(prev => prev.map((p, i) => 
          i === slotIndex ? { ...p, data: compressed } : p
        ))
      }
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.map((p, i) => 
      i === index ? { ...p, data: undefined } : p
    ))
  }

  const canProceed = () => {
    switch (step) {
      case 'address': return propertyAddress.trim().length > 0
      case 'jurisdiction': return jurisdiction.length > 0
      case 'capture': return photos.some(p => p.data)
      case 'review': return true
      default: return false
    }
  }

  const startAnalysis = async () => {
    setStep('analyzing')
    setAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: photos.filter(p => p.data).map(p => p.data),
          address: propertyAddress,
          jurisdiction
        })
      })
      
      if (!response.ok) throw new Error('Analysis failed')
      
      const result = await response.json()
      
      // Store result and redirect to dashboard with report
      if (typeof window !== 'undefined') {
        localStorage.setItem('latestReport', JSON.stringify({
          ...result,
          propertyAddress,
          timestamp: new Date().toISOString(),
          images: photos.filter(p => p.data).map(p => p.data)
        }))
      }
      
      router.push('/dashboard')
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Analysis failed. Please try again.')
      setStep('review')
    } finally {
      setAnalyzing(false)
    }
  }

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 'address':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Property Address</h2>
              <p className="text-slate-400">Enter the property to audit</p>
            </div>
            
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="123 Main Street, San Diego, CA"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-lg"
              autoFocus
            />
            
            <button
              onClick={() => jurisdiction ? setStep('capture') : setStep('jurisdiction')}
              disabled={!canProceed()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )
        
      case 'jurisdiction':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Jurisdiction</h2>
              <p className="text-slate-400">Select your fire authority</p>
            </div>
            
            <div className="space-y-3">
              {JURISDICTIONS.map(j => (
                <button
                  key={j.id}
                  onClick={() => setJurisdiction(j.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    jurisdiction === j.id 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-white/10 bg-slate-800 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{j.name}</div>
                      <div className="text-sm text-slate-400">{j.description}</div>
                    </div>
                    {jurisdiction === j.id && (
                      <Check className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setStep('capture')}
              disabled={!canProceed()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )
        
      case 'capture':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Forensic Imagery</h2>
              <p className="text-slate-400">Capture all four perspectives</p>
            </div>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-slate-800 border-2 border-white/10 relative">
                  {photo.data ? (
                    <>
                      <img src={photo.data} alt={photo.label} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-emerald-500 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> Captured
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => startCamera(photo.id)}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition"
                    >
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="text-sm">{photo.label}</span>
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, index)}
                    className="hidden"
                    id={`file-${index}`}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-slate-400 text-center">
              Tap a box to capture or upload a photo
            </p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={() => setStep('review')}
              disabled={!canProceed()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              Review Photos
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )
        
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Review Photos</h2>
              <p className="text-slate-400">Make sure all perspectives are clear</p>
            </div>
            
            <div className="space-y-3">
              {photos.filter(p => p.data).map((photo, index) => (
                <div key={photo.id} className="bg-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-700 px-4 py-2 text-sm font-medium text-white">
                    {photo.label}
                  </div>
                  <img src={photo.data} alt={photo.label} className="w-full aspect-video object-cover" />
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep('capture')}
                className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retake
              </button>
              <button
                onClick={startAnalysis}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                Begin Analysis
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>
        )
        
      case 'analyzing':
        return (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Photos</h2>
            <p className="text-slate-400 mb-4">Our AI is reviewing your property for Zone 0 compliance</p>
            
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Scanning for violations
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Analyzing structure hardening
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Generating remediation plan
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white hover:text-emerald-400">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-white">Zone Zero</span>
            </div>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className={step === 'address' ? 'text-emerald-400' : ''}>Address</span>
            <span className={step === 'jurisdiction' ? 'text-emerald-400' : ''}>Jurisdiction</span>
            <span className={step === 'capture' || step === 'review' ? 'text-emerald-400' : ''}>Photos</span>
            <span className={step === 'analyzing' ? 'text-emerald-400' : ''}>Analysis</span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: step === 'address' ? '12%' : 
                       step === 'jurisdiction' ? '37%' : 
                       step === 'capture' ? '62%' :
                       step === 'review' ? '87%' : '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {renderStep()}
      </main>

      {/* Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 bg-black z-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={stopCamera}
              className="bg-white/20 text-white px-4 py-2 rounded-full"
            >
              Cancel
            </button>
            <div className="bg-black/50 text-white px-4 py-2 rounded-full">
              {PHOTO_SLOTS[currentSlot]?.label}
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full border-4 border-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
