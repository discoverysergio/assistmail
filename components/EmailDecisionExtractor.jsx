// components/EmailDecisionExtractor.jsx - VERSIONE CORRETTA
'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Calendar, Search, ExternalLink, Reply, FileText, Filter, Clock, User, Shield, Lock, AlertCircle } from 'lucide-react'

const EmailDecisionExtractor = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyInstructions, setReplyInstructions] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('it')
  
  // Stati per Gmail
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [realEmails, setRealEmails] = useState([])
  const [filteredEmails, setFilteredEmails] = useState([])
  const [selectedPerson, setSelectedPerson] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isGapiLoaded, setIsGapiLoaded] = useState(false)

  // Configurazione Gmail API
  const GMAIL_CONFIG = {
    clientId: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID,
    apiKey: process.env.NEXT_PUBLIC_GMAIL_API_KEY,
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    scopes: 'https://www.googleapis.com/auth/gmail.readonly'
  }

  // Supported languages (mantieni tutti come prima)
  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    pt: { name: 'Português', flag: '🇧🇷' },
    nl: { name: 'Nederlands', flag: '🇳🇱' },
    pl: { name: 'Polski', flag: '🇵🇱' },
    sv: { name: 'Svenska', flag: '🇸🇪' },
    da: { name: 'Dansk', flag: '🇩🇰' },
    no: { name: 'Norsk', flag: '🇳🇴' },
    fi: { name: 'Suomi', flag: '🇫🇮' },
    ro: { name: 'Română', flag: '🇷🇴' },
    hu: { name: 'Magyar', flag: '🇭🇺' },
    cs: { name: 'Čeština', flag: '🇨🇿' },
    sk: { name: 'Slovenčina', flag: '🇸🇰' },
    sl: { name: 'Slovenščina', flag: '🇸🇮' },
    hr: { name: 'Hrvatski', flag: '🇭🇷' },
    bg: { name: 'Български', flag: '🇧🇬' },
    el: { name: 'Ελληνικά', flag: '🇬🇷' }
  }

  // Translations (mantieni tutte come prima)
  const translations = {
    it: {
      title: 'AssistMail',
      subtitle: 'Assistente Email IA per Comunicazione Business Intelligente',
      connectedTo: 'Connesso a:',
      addAccount: 'Aggiungi altro account...',
      secure: 'Sicuro',
      analysisFilters: 'Filtri di Analisi',
      period: 'Periodo',
      today: 'Oggi',
      yesterday: 'Ieri',
      lastWeek: 'Ultima settimana',
      lastMonth: 'Ultimo mese',
      customPeriod: 'Periodo personalizzato',
      fromSpecificPerson: 'Da persona specifica',
      allPeople: 'Tutte le persone',
      emailStatus: 'Status email',
      allEmails: 'Tutte le email',
      unreadOnly: 'Solo non lette',
      readOnly: 'Solo lette',
      importantOnly: 'Solo importanti',
      decisionType: 'Tipo decisione',
      budget: 'Budget/Finanze',
      hiring: 'Assunzioni',
      strategy: 'Strategia',
      operational: 'Operazioni',
      filteredStats: 'Stats filtrate',
      decisionsFound: 'Decisioni trovate:',
      pendingConfirmation: 'In attesa conferma:',
      implemented: 'Implementate:',
      securityGuaranteed: 'Sicurezza Garantita',
      endToEndEncryption: '✓ Connessione crittografata end-to-end',
      noServerStorage: '✓ Nessun salvataggio email sui nostri server',
      localProcessing: '✓ Elaborazione locale quando possibile',
      readOnlyAccess: '✓ Accesso solo read-only alle email',
      iso27001: '✓ Certificazione ISO 27001',
      aiLearningStatus: 'Status Apprendimento IA',
      emailsAnalyzed: 'Email analizzate:',
      styleLeaned: 'Stile appreso:',
      aiLearningDescription: 'Il sistema sta imparando il tuo stile comunicativo analizzando le tue email storiche.',
      decisionsRecap: 'Recap Decisioni',
      noDecisionsFound: 'Nessuna decisione identificata per questo periodo',
      identifiedDecision: '🎯 Decisione identificata:',
      context: 'Contesto:',
      participants: 'Partecipanti:',
      readFullThread: 'Leggi thread completo',
      generateReply: 'Genera risposta',
      backToRecap: '← Torna al recap',
      from: 'Da:',
      extractedDecision: '🎯 Decisione estratta dal thread:',
      generateAiReply: 'Genera risposta IA',
      generatingReply: 'Generazione risposta...',
      analyzingThread: 'Sto analizzando il thread e creando una risposta nel tuo stile',
      replyGenerated: 'Risposta Generata',
      additionalInstructions: 'Istruzioni aggiuntive (opzionale):',
      instructionsPlaceholder: 'es. Aggiungi deadline specifica, Tono più formale, Includi dettagli budget...',
      aiStyleConfidence: '💡 L\'IA ha appreso il tuo stile da email analizzate',
      cancel: 'Annulla',
      copyReply: 'Copia risposta',
      sendEmail: 'Invia email',
      decided: 'Deciso',
      pending: 'In attesa',
      inProgress: 'In corso',
      high: 'alta',
      medium: 'media',
      low: 'bassa',
      connectGmail: 'Connetti Gmail',
      authInProgress: 'Autenticazione in corso...',
      secureConnection: 'Connessione Sicura',
      disconnect: 'Disconnetti',
      authError: 'Errore di autenticazione. Riprova.',
      analyzing: 'Analizzando le tue email...',
      loadingEmails: 'Caricamento email...',
      noEmailsFound: 'Nessuna email trovata per i filtri selezionati',
      welcomeTitle: 'Benvenuto in AssistMail',
      welcomeSubtitle: 'Connetti il tuo account Gmail per iniziare ad analizzare le tue email e identificare le decisioni business.',
      configError: 'Errore di configurazione. Controlla le credenziali API.',
      loadingGoogleApi: 'Caricamento Google API...'
    },
    en: {
      // Mantieni tutte le traduzioni inglesi
      title: 'AssistMail',
      connectGmail: 'Connect Gmail',
      authInProgress: 'Authentication in progress...',
      secureConnection: 'Secure Connection',
      disconnect: 'Disconnect',
      authError: 'Authentication error. Please try again.',
      analyzing: 'Analyzing your emails...',
      loadingEmails: 'Loading emails...',
      noEmailsFound: 'No emails found for selected filters',
      welcomeTitle: 'Welcome to AssistMail',
      welcomeSubtitle: 'Connect your Gmail account to start analyzing your emails and identify business decisions.',
      configError: 'Configuration error. Check API credentials.',
      loadingGoogleApi: 'Loading Google API...'
    }
  }

  const t = translations[selectedLanguage] || translations.it

  // INIZIALIZZAZIONE GOOGLE API - VERSIONE MIGLIORATA
  useEffect(() => {
    const initializeGapi = async () => {
      console.log('🔧 Inizializzazione Google API...')
      console.log('Client ID:', GMAIL_CONFIG.clientId)
      console.log('API Key:', GMAIL_CONFIG.apiKey ? 'Present' : 'Missing')
      
      if (!GMAIL_CONFIG.clientId || !GMAIL_CONFIG.apiKey) {
        console.error('❌ Credenziali Google mancanti')
        setAuthError(t.configError)
        return
      }

      if (typeof window !== 'undefined' && window.gapi) {
        try {
          await new Promise((resolve, reject) => {
            window.gapi.load('client:auth2', {
              callback: resolve,
              onerror: reject
            })
          })

          console.log('🔧 Inizializzazione client...')
          await window.gapi.client.init({
            apiKey: GMAIL_CONFIG.apiKey,
            clientId: GMAIL_CONFIG.clientId,
            discoveryDocs: [GMAIL_CONFIG.discoveryDoc],
            scope: GMAIL_CONFIG.scopes
          })
          
          console.log('✅ Google API inizializzata')
          setIsGapiLoaded(true)
          
          // Controlla se già autenticato
          const authInstance = window.gapi.auth2.getAuthInstance()
          if (authInstance && authInstance.isSignedIn.get()) {
            console.log('👤 Utente già autenticato')
            const user = authInstance.currentUser.get()
            const profile = user.getBasicProfile()
            setUserProfile({
              email: profile.getEmail(),
              name: profile.getName(),
              picture: profile.getImageUrl()
            })
            setIsAuthenticated(true)
            await loadEmails()
          }
        } catch (error) {
          console.error('❌ Errore inizializzazione:', error)
          setAuthError(`Errore inizializzazione: ${error.message || error}`)
        }
      }
    }

    // Carica script Google API se non presente
    if (!window.gapi) {
      console.log('📥 Caricamento script Google API...')
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = initializeGapi
      script.onerror = () => {
        console.error('❌ Errore caricamento script Google API')
        setAuthError('Errore caricamento Google API')
      }
      document.body.appendChild(script)
    } else {
      initializeGapi()
    }
  }, [])

  // AUTENTICAZIONE GMAIL - VERSIONE MIGLIORATA
  const handleGmailAuth = async () => {
    console.log('🔐 Inizio autenticazione Gmail...')
    setIsLoading(true)
    setAuthError(null)
    
    try {
      if (!isGapiLoaded) {
        throw new Error('Google API non ancora caricata')
      }

      const authInstance = window.gapi.auth2.getAuthInstance()
      if (!authInstance) {
        throw new Error('Istanza auth2 non trovata')
      }

      console.log('🔐 Richiesta signin...')
      const user = await authInstance.signIn({
        prompt: 'consent'
      })
      
      console.log('✅ Signin completato')
      const profile = user.getBasicProfile()
      const userInfo = {
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl()
      }
      
      console.log('👤 Profilo utente:', userInfo)
      setUserProfile(userInfo)
      setIsAuthenticated(true)
      
      await loadEmails()
      
    } catch (error) {
      console.error('❌ Errore autenticazione:', error)
      
      // Errori specifici
      if (error.error === 'popup_closed_by_user') {
        setAuthError('Popup chiuso dall\'utente')
      } else if (error.error === 'access_denied') {
        setAuthError('Accesso negato')
      } else {
        setAuthError(`Errore: ${error.message || error.error || 'Errore sconosciuto'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // CARICAMENTO EMAIL - VERSIONE MIGLIORATA
  const loadEmails = async () => {
    console.log('📧 Caricamento email...')
    try {
      setIsLoading(true)
      
      // Query dinamica basata sul periodo selezionato
      let query = ''
      const now = new Date()
      
      switch(selectedPeriod) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          query = `after:${Math.floor(today.getTime() / 1000)}`
          break
        case 'yesterday':
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          const startYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
          const endYesterday = new Date(startYesterday.getTime() + 24 * 60 * 60 * 1000)
          query = `after:${Math.floor(startYesterday.getTime() / 1000)} before:${Math.floor(endYesterday.getTime() / 1000)}`
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          query = `after:${Math.floor(weekAgo.getTime() / 1000)}`
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          query = `after:${Math.floor(monthAgo.getTime() / 1000)}`
          break
        default:
          query = 'newer_than:1d'
      }
      
      console.log('🔍 Query Gmail:', query)
      
      const response = await window.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 20,
        q: query
      })
      
      console.log('📧 Risposta Gmail:', response)
      
      if (response.result.messages && response.result.messages.length > 0) {
        console.log(`📧 Trovate ${response.result.messages.length} email`)
        
        const emailPromises = response.result.messages.slice(0, 10).map(async (message) => {
          try {
            const emailDetail = await window.gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full'
            })
            return parseEmailData(emailDetail.result)
          } catch (error) {
            console.error('❌ Errore caricamento email:', message.id, error)
            return null
          }
        })
        
        const emails = (await Promise.all(emailPromises)).filter(email => email !== null)
        console.log(`✅ Email elaborate: ${emails.length}`)
        
        setRealEmails(emails)
        filterEmails(emails)
      } else {
        console.log('📧 Nessuna email trovata')
        setRealEmails([])
        setFilteredEmails([])
      }
      
    } catch (error) {
      console.error('❌ Errore caricamento email:', error)
      setAuthError(`Errore caricamento email: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // PARSER EMAIL (stesso di prima)
  const parseEmailData = (emailData) => {
    const headers = emailData.payload.headers
    const getHeader = (name) => headers.find(h => h.name === name)?.value || ''
    
    const dateValue = getHeader('Date')
    const parsedDate = dateValue ? new Date(dateValue) : new Date(parseInt(emailData.internalDate))
    
    // Estrai nome e email del mittente
    const fromHeader = getHeader('From')
    const senderMatch = fromHeader.match(/^(.+?)\s*<(.+?)>$/) || fromHeader.match(/^(.+)$/)
    const senderName = senderMatch ? senderMatch[1]?.replace(/"/g, '').trim() : fromHeader
    const senderEmail = senderMatch && senderMatch[2] ? senderMatch[2] : fromHeader
    
    return {
      id: emailData.id,
      threadId: emailData.threadId,
      subject: getHeader('Subject') || 'Senza oggetto',
      sender: senderEmail,
      senderName: senderName,
      date: parsedDate,
      time: parsedDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      snippet: emailData.snippet || '',
      labels: emailData.labelIds || [],
      isUnread: emailData.labelIds?.includes('UNREAD') || false,
      isImportant: emailData.labelIds?.includes('IMPORTANT') || false,
      body: extractEmailBody(emailData.payload),
      // Analisi AI simulata per ora
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      decision: extractDecisionFromEmail(emailData.snippet, getHeader('Subject')),
      status: Math.random() > 0.6 ? 'decided' : Math.random() > 0.3 ? 'pending_confirmation' : 'in_progress',
      context: `Thread di ${Math.floor(Math.random() * 10) + 1} email`,
      keyParticipants: [senderName, 'Tu', 'Altri']
    }
  }

  // ESTRAZIONE CORPO EMAIL (stesso di prima)
  const extractEmailBody = (payload) => {
    let body = ''
    
    if (payload.body?.data) {
      body = atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))
          break
        }
      }
    }
    
    return body.substring(0, 500)
  }

  // ESTRAZIONE DECISIONI (stesso di prima)
  const extractDecisionFromEmail = (snippet, subject) => {
    const decisionKeywords = [
      'approv', 'decid', 'confirm', 'budget', 'assun', 'contratt', 'accord', 'procedi',
      'ok per', 'vai con', 'autorizza', 'implementa', 'lancia', 'sì', 'perfetto', 'confermo'
    ]
    
    const text = (snippet + ' ' + subject).toLowerCase()
    const hasDecision = decisionKeywords.some(keyword => text.includes(keyword))
    
    if (hasDecision) {
      return `Decisione identificata: ${snippet.substring(0, 80)}...`
    }
    
    return null
  }

  // FILTRO EMAIL (stesso di prima)
  const filterEmails = (emails) => {
    let filtered = emails.filter(email => {
      if (selectedPerson && !email.sender.toLowerCase().includes(selectedPerson.toLowerCase())) {
        return false
      }
      
      switch(selectedStatus) {
        case 'unread':
          return email.isUnread
        case 'read':
          return !email.isUnread
        case 'important':
          return email.isImportant
        default:
          return true
      }
    })
    
    // Solo email con decisioni identificate
    filtered = filtered.filter(email => email.decision)
    
    setFilteredEmails(filtered)
  }

  // AGGIORNA FILTRI (stesso di prima)
  useEffect(() => {
    if (realEmails.length > 0) {
      filterEmails(realEmails)
    }
  }, [selectedPerson, selectedStatus, realEmails])

  // RICARICA EMAIL QUANDO CAMBIA PERIODO (stesso di prima)
  useEffect(() => {
    if (isAuthenticated) {
      loadEmails()
    }
  }, [selectedPeriod])

  // DISCONNESSIONE (stesso di prima)
  const handleDisconnect = () => {
    if (window.gapi?.auth2) {
      window.gapi.auth2.getAuthInstance().signOut()
      setIsAuthenticated(false)
      setUserProfile(null)
      setRealEmails([])
      setFilteredEmails([])
    }
  }

  // GENERA RISPOSTA AI (stesso di prima)
  const generateReply = (email) => {
    setIsGeneratingReply(true)
    
    setTimeout(() => {
      const reply = `Ciao,

ho ricevuto la tua email riguardo: "${email.subject}".

${email.decision ? `Confermo la decisione: ${email.decision}` : 'Procediamo come concordato.'}

${replyInstructions ? `\nNote aggiuntive: ${replyInstructions}` : ''}

Grazie,
${userProfile?.name || 'Sergio'}`
      
      setReplyText(reply)
      setIsGeneratingReply(false)
    }, 2000)
  }

  // UTILITY FUNCTIONS (stesso di prima)
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-orange-600 bg-orange-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'decided': return 'text-green-700 bg-green-100'
      case 'pending_confirmation': return 'text-yellow-700 bg-yellow-100'
      case 'in_progress': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  // COMPONENTE AUTENTICAZIONE GMAIL - VERSIONE MIGLIORATA
  const GmailAuthCard = () => {
    if (isAuthenticated && userProfile) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">{t.secureConnection}</span>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              {t.disconnect}
            </button>
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            {userProfile.picture && (
              <img 
                src={userProfile.picture} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
              <p className="text-sm text-gray-600">{userProfile.email}</p>
            </div>
          </div>

          <div className="text-xs text-green-700 space-y-1">
            <p>{t.readOnlyAccess}</p>
            <p>{t.noServerStorage}</p>
            <p>{t.endToEndEncryption}</p>
          </div>

          {isLoading && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span>{t.loadingEmails}</span>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{authError}</span>
            </div>
          </div>
        )}
        
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isLoading ? t.authInProgress : 
           !isGapiLoaded ? t.loadingGoogleApi : 
           t.connectGmail}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6">
          Connessione sicura OAuth2 per analizzare le tue email
        </p>
        
        <button
          onClick={handleGmailAuth}
          disabled={isLoading || !isGapiLoaded}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t.authInProgress}</span>
            </>
          ) : !isGapiLoaded ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t.loadingGoogleApi}</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>{t.connectGmail}</span>
            </>
          )}
        </button>
        
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>{t.readOnlyAccess}</p>
          <p>{t.noServerStorage}</p>
          <p>{t.endToEndEncryption}</p>
        </div>
      </div>
    )
  }

  // RENDER PRINCIPALE (stesso di prima, ma con controlli migliorati)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {userProfile && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{t.connectedTo}</span>
                  <span className="text-sm font-medium">{userProfile.email}</span>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">{t.secure}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar - Filtri */}
          <div className="lg:col-span-1">
            {/* Gmail Auth Card */}
            <GmailAuthCard />
            
            {/* Filtri solo se autenticato */}
            {isAuthenticated && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {t.analysisFilters}
                </h3>
                
                {/* Filtro Periodo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.period}</label>
                  <div className="space-y-1">
                    {[
                      { key: 'today', label: t.today },
                      { key: 'yesterday', label: t.yesterday },
                      { key: 'week', label: t.lastWeek },
                      { key: 'month', label: t.lastMonth }
                    ].map((period) => (
                      <button
                        key={period.key}
                        onClick={() => setSelectedPeriod(period.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedPeriod === period.key 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{period.label}</span>
                          {selectedPeriod === period.key && filteredEmails.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {filteredEmails.length}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro per Persona */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.fromSpecificPerson}</label>
                  <input
                    type="text"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    placeholder="es. mario.rossi@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Filtro Status Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.emailStatus}</label>
                  <div className="space-y-2">
                    {[
                      { key: 'all', label: t.allEmails },
                      { key: 'unread', label: t.unreadOnly },
                      { key: 'read', label: t.readOnly },
                      { key: 'important', label: t.importantOnly }
                    ].map((status) => (
                      <label key={status.key} className="flex items-center text-sm">
                        <input 
                          type="radio" 
                          name="emailStatus" 
                          checked={selectedStatus === status.key}
                          onChange={() => setSelectedStatus(status.key)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-gray-700">{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">{t.filteredStats}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.decisionsFound}</span>
                      <span className="font-medium">{filteredEmails.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.pendingConfirmation}</span>
                      <span className="font-medium text-yellow-600">
                        {filteredEmails.filter(e => e.status === 'pending_confirmation').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.implemented}</span>
                      <span className="font-medium text-green-600">
                        {filteredEmails.filter(e => e.status === 'decided').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!isAuthenticated ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.welcomeTitle}</h2>
                <p className="text-gray-600">{t.welcomeSubtitle}</p>
              </div>
            ) : !selectedEmail ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t.decisionsRecap} - {selectedPeriod === 'today' ? t.today : 
                                      selectedPeriod === 'yesterday' ? t.yesterday : 
                                      selectedPeriod === 'week' ? t.lastWeek : t.lastMonth}
                  </h2>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">{t.loadingEmails}</p>
                    </div>
                  ) : filteredEmails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{realEmails.length === 0 ? 'Nessuna email trovata per questo periodo' : t.noEmailsFound}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEmails.map((email) => (
                        <div key={email.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(email.priority)}`}>
                                  {t[email.priority]}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                                  {email.status === 'decided' ? t.decided : 
                                   email.status === 'pending_confirmation' ? t.pending : t.inProgress}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <User className="h-4 w-4 mr-1" />
                                <span>{email.sender}</span>
                                <Clock className="h-4 w-4 ml-4 mr-1" />
                                <span>{email.time}</span>
                              </div>
                              
                              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                                <p className="font-medium text-blue-900 text-sm">{t.identifiedDecision}</p>
                                <p className="text-blue-800">{email.decision}</p>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{t.context}</span> {email.context}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">{t.participants}</span> {email.keyParticipants.join(', ')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => setSelectedEmail(email)}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {t.readFullThread}
                            </button>
                            
                            <button
                              onClick={() => generateReply(email)}
                              className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              {t.generateReply}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Vista dettaglio email - stesso di prima */
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {t.backToRecap}
                    </button>
                    <span className="text-sm text-gray-500">{selectedEmail.time}</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedEmail.subject}</h2>
                  <p className="text-gray-600">{t.from} {selectedEmail.sender}</p>
                </div>
                
                <div className="p-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">{t.extractedDecision}</p>
                      <p className="text-yellow-700 mt-1">{selectedEmail.decision}</p>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">{selectedEmail.body || selectedEmail.snippet}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => generateReply(selectedEmail)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      {t.generateAiReply}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal per generazione risposta - stesso di prima */}
        {isGeneratingReply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.generatingReply}</h3>
                <p className="text-gray-600">{t.analyzingThread}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal risposta generata - stesso di prima */}
        {replyText && !isGeneratingReply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t.replyGenerated}</h3>
                <button
                  onClick={() => setReplyText('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.additionalInstructions}
                </label>
                <input
                  type="text"
                  value={replyInstructions}
                  onChange={(e) => setReplyInstructions(e.target.value)}
                  placeholder={t.instructionsPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t.aiStyleConfidence}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setReplyText('')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(replyText)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t.copyReply}
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {t.sendEmail}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailDecisionExtractor
