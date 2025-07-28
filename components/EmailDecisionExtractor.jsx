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
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  // Configurazione Google Identity Services (NUOVA API)
  const GOOGLE_CONFIG = {
    clientId: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID,
    apiKey: process.env.NEXT_PUBLIC_GMAIL_API_KEY,
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
  }

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

  // INIZIALIZZAZIONE NUOVA GOOGLE IDENTITY SERVICES
  useEffect(() => {
    const initializeGoogleIdentity = async () => {
      console.log('🆕 Inizializzazione Google Identity Services...')
      console.log('Client ID:', GOOGLE_CONFIG.clientId)
      console.log('API Key:', GOOGLE_CONFIG.apiKey ? 'Present' : 'Missing')
      
      if (!GOOGLE_CONFIG.clientId || !GOOGLE_CONFIG.apiKey) {
        const missingCredentials = []
        if (!GOOGLE_CONFIG.clientId) missingCredentials.push('Client ID')
        if (!GOOGLE_CONFIG.apiKey) missingCredentials.push('API Key')
        
        console.error('❌ Credenziali Google mancanti:', missingCredentials.join(', '))
        setAuthError(`Credenziali mancanti: ${missingCredentials.join(', ')}`)
        return
      }

      if (typeof window !== 'undefined') {
        try {
          // Carica Google Identity Services (NUOVA API)
          await loadGoogleIdentityScript()
          
          // Inizializza Google API Client (per chiamate Gmail)
          await loadGoogleAPIScript()
          
          console.log('✅ Google Identity Services caricato')
          setIsGoogleLoaded(true)
          
        } catch (error) {
          console.error('❌ Errore caricamento Google Identity:', error)
          setAuthError(`Errore caricamento: ${error.message}`)
        }
      }
    }

    initializeGoogleIdentity()
  }, [])

  // Carica script Google Identity Services
  const loadGoogleIdentityScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.onload = () => {
        console.log('✅ Google Identity script caricato')
        resolve()
      }
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  // Carica Google API Client per Gmail
  const loadGoogleAPIScript = () => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = async () => {
        console.log('✅ Google API script caricato')
        
        // Inizializza gapi
        await new Promise((gapiResolve, gapiReject) => {
          window.gapi.load('client', {
            callback: gapiResolve,
            onerror: gapiReject
          })
        })

        await window.gapi.client.init({
          apiKey: GOOGLE_CONFIG.apiKey,
          discoveryDocs: GOOGLE_CONFIG.discoveryDocs
        })
        
        console.log('✅ Google API Client inizializzato')
        resolve()
      }
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  // AUTENTICAZIONE CON NUOVA API
  const handleGmailAuth = async () => {
    console.log('🔐 Inizio autenticazione con Google Identity Services...')
    setIsLoading(true)
    setAuthError(null)
    
    try {
      if (!isGoogleLoaded) {
        throw new Error('Google Identity Services non ancora caricato')
      }

      // Configurazione token client (NUOVA API)
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scope,
        callback: async (response) => {
          console.log('✅ Token ricevuto:', response)
          
          if (response.error) {
            console.error('❌ Errore token:', response.error)
            setAuthError(`Errore token: ${response.error}`)
            setIsLoading(false)
            return
          }

          // Salva access token
          setAccessToken(response.access_token)
          
          // Ottieni info profilo utente
          try {
            const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${response.access_token}`
              }
            })
            
            const profileData = await profileResponse.json()
            console.log('👤 Profilo utente:', profileData)
            
            setUserProfile({
              email: profileData.email,
              name: profileData.name,
              picture: profileData.picture
            })
            
            setIsAuthenticated(true)
            await loadEmails(response.access_token)
            
          } catch (profileError) {
            console.error('❌ Errore caricamento profilo:', profileError)
            setAuthError('Errore caricamento profilo utente')
          }
          
          setIsLoading(false)
        }
      })

      // Richiedi token
      client.requestAccessToken({ prompt: 'consent' })
      
    } catch (error) {
      console.error('❌ Errore autenticazione:', error)
      setAuthError(`Errore autenticazione: ${error.message}`)
      setIsLoading(false)
    }
  }

  // CARICAMENTO EMAIL CON NUOVA API
  const loadEmails = async (token = accessToken) => {
    console.log('📧 Caricamento email...')
    console.log('📧 Token disponibile:', !!token)
    console.log('📧 Token (primi 20 char):', token ? token.substring(0, 20) + '...' : 'MANCANTE')
    
    try {
      setIsLoading(true)
      
      if (!token) {
        throw new Error('Access token mancante')
      }

      // Configura headers per Gmail API
      console.log('🔧 Configurazione Google API Client...')
      window.gapi.client.setApiKey(GOOGLE_CONFIG.apiKey)
      window.gapi.client.setToken({ access_token: token })
      
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
      console.log('🔍 Periodo selezionato:', selectedPeriod)
      
      const response = await window.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 20,
        q: query
      })
      
      console.log('📧 Risposta Gmail completa:', response)
      console.log('📧 Status risposta:', response.status)
      console.log('📧 Messaggi trovati:', response.result?.messages?.length || 0)
      
      if (response.result.messages && response.result.messages.length > 0) {
        console.log(`📧 Trovate ${response.result.messages.length} email`)
        console.log('📧 Prima email ID:', response.result.messages[0].id)
        
        const emailPromises = response.result.messages.slice(0, 10).map(async (message) => {
          try {
            console.log(`📧 Caricamento dettagli email: ${message.id}`)
            const emailDetail = await window.gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full'
            })
            console.log(`✅ Email ${message.id} caricata:`, emailDetail.result.snippet?.substring(0, 50))
            return parseEmailData(emailDetail.result)
          } catch (error) {
            console.error('❌ Errore caricamento email:', message.id, error)
            return null
          }
        })
        
        const emails = (await Promise.all(emailPromises)).filter(email => email !== null)
        console.log(`✅ Email elaborate: ${emails.length}`)
        console.log('📧 Email elaborate:', emails.map(e => ({ subject: e.subject, sender: e.sender, decision: !!e.decision })))
        
        setRealEmails(emails)
        filterEmails(emails)
      } else {
        console.log('📧 Nessuna email trovata nel periodo specificato')
        console.log('📧 Response result:', response.result)
        setRealEmails([])
        setFilteredEmails([])
      }
      
    } catch (error) {
      console.error('❌ Errore caricamento email completo:', error)
      console.error('❌ Errore message:', error.message)
      console.error('❌ Errore status:', error.status)
      setAuthError(`Errore caricamento email: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // PARSER EMAIL (aggiornato per nuove categorie)
  const parseEmailData = (emailData) => {
    const headers = emailData.payload.headers
    const getHeader = (name) => headers.find(h => h.name === name)?.value || ''
    
    const dateValue = getHeader('Date')
    const parsedDate = dateValue ? new Date(dateValue) : new Date(parseInt(emailData.internalDate))
    
    const fromHeader = getHeader('From')
    const senderMatch = fromHeader.match(/^(.+?)\s*<(.+?)>$/) || fromHeader.match(/^(.+)$/)
    const senderName = senderMatch ? senderMatch[1]?.replace(/"/g, '').trim() : fromHeader
    const senderEmail = senderMatch && senderMatch[2] ? senderMatch[2] : fromHeader
    
    // Nuova categorizzazione intelligente
    const emailAnalysis = extractDecisionFromEmail(emailData.snippet, getHeader('Subject'), senderEmail)
    
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
      // Nuovi campi per categorizzazione
      priority: emailAnalysis.priority,
      decision: emailAnalysis.text,
      category: emailAnalysis.category,
      status: emailAnalysis.category === 'business' ? 'pending_confirmation' : 'info',
      context: `${emailAnalysis.category} - Thread di 1 email`,
      keyParticipants: [senderName, 'Tu']
    }
  }

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

  const extractDecisionFromEmail = (snippet, subject, sender) => {
    const text = (snippet + ' ' + subject + ' ' + sender).toLowerCase()
    
    console.log('🤖 Categorizzazione email:', subject)
    console.log('🤖 Da:', sender)
    console.log('🤖 Snippet:', snippet.substring(0, 100))
    
    // CATEGORIA 1: EMAIL BUSINESS/IMPORTANTI
    const businessKeywords = [
      // Italiano
      'meeting', 'riunione', 'call', 'chiamata', 'progetto', 'project', 'budget', 'contratto',
      'assunzione', 'colloquio', 'cliente', 'fornitore', 'partnership', 'accordo', 'decisione',
      'approv', 'confirm', 'urgent', 'importante', 'scadenza', 'deadline', 'fattura', 'pagamento',
      
      // Inglese
      'approve', 'contract', 'invoice', 'payment', 'client', 'customer', 'supplier', 'vendor',
      'partnership', 'agreement', 'urgent', 'important', 'deadline', 'schedule', 'appointment'
    ]
    
    // CATEGORIA 2: PROMOZIONI/OFFERTE
    const promoKeywords = [
      'sconto', 'offerta', 'promozione', 'sale', 'discount', 'offer', 'deal', 'limited time',
      'fino a', 'until', 'black friday', 'cyber monday', 'special price', 'prezzo speciale',
      'gratis', 'free', 'omaggio', 'gift', 'coupon', 'codice sconto', 'risparmia', 'save'
    ]
    
    // CATEGORIA 3: NEWSLETTER/AGGIORNAMENTI
    const newsletterKeywords = [
      'newsletter', 'aggiornamento', 'update', 'news', 'notizie', 'trend', 'mercato', 'market',
      'report', 'analisi', 'insights', 'industry', 'settore', 'weekly', 'monthly', 'settimanale'
    ]
    
    // Controlla se è da dominio aziendale/importante
    const isBusinessSender = sender.includes('across.it') || sender.includes('syneton.it') || 
                            sender.includes('@gmail.com') || sender.includes('@outlook.com') ||
                            !sender.includes('noreply') && !sender.includes('no-reply')
    
    // CATEGORIZZAZIONE
    let category = 'other'
    let priority = 'low'
    let decision = ''
    
    // Email Business (priorità alta)
    if (businessKeywords.some(keyword => text.includes(keyword)) || isBusinessSender) {
      category = 'business'
      priority = 'high'
      decision = `📋 Business: ${snippet.substring(0, 80)}...`
      console.log('✅ Categoria: BUSINESS')
    }
    // Promozioni (priorità media)
    else if (promoKeywords.some(keyword => text.includes(keyword))) {
      category = 'promotion'
      priority = 'medium'
      decision = `🎯 Promozione: ${snippet.substring(0, 80)}...`
      console.log('✅ Categoria: PROMOZIONE')
    }
    // Newsletter (priorità bassa)
    else if (newsletterKeywords.some(keyword => text.includes(keyword))) {
      category = 'newsletter'
      priority = 'low'
      decision = `📰 Newsletter: ${snippet.substring(0, 80)}...`
      console.log('✅ Categoria: NEWSLETTER')
    }
    // Email generiche (mostra comunque)
    else {
      category = 'general'
      priority = 'low'
      decision = `📧 Email: ${snippet.substring(0, 80)}...`
      console.log('✅ Categoria: GENERALE')
    }
    
    return {
      text: decision,
      category: category,
      priority: priority
    }
  }

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
    
    // TEMPORANEO: Mostra tutte le email (rimuovi filtro decisioni)
    console.log('🔍 Email dopo filtro persona/status:', filtered.length)
    console.log('🔍 Email con decisioni:', filtered.filter(email => email.decision).length)
    
    // Mostra tutte le email per debugging
    setFilteredEmails(filtered)
  }

  useEffect(() => {
    if (realEmails.length > 0) {
      filterEmails(realEmails)
    }
  }, [selectedPerson, selectedStatus, realEmails])

  useEffect(() => {
    console.log('🔄 Periodo cambiato:', selectedPeriod)
    console.log('🔄 Autenticato:', isAuthenticated)
    console.log('🔄 Token presente:', !!accessToken)
    
    if (isAuthenticated && accessToken) {
      console.log('✅ Avvio caricamento email per periodo:', selectedPeriod)
      loadEmails()
    } else {
      console.log('❌ Non posso caricare email - mancano auth o token')
    }
  }, [selectedPeriod])

  const handleDisconnect = () => {
    if (window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        console.log('✅ Token revocato')
      })
    }
    setIsAuthenticated(false)
    setUserProfile(null)
    setAccessToken(null)
    setRealEmails([])
    setFilteredEmails([])
  }

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

  // COMPONENTE AUTENTICAZIONE GMAIL
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
           !isGoogleLoaded ? t.loadingGoogleApi : 
           t.connectGmail}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6">
          Connessione sicura con Google Identity Services (Nuova API)
        </p>
        
        <button
          onClick={handleGmailAuth}
          disabled={isLoading || !isGoogleLoaded}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t.authInProgress}</span>
            </>
          ) : !isGoogleLoaded ? (
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
          <p>✓ Nuova Google Identity Services API</p>
        </div>
      </div>
    )
  }

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
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GmailAuthCard />
            
            {isAuthenticated && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {t.analysisFilters}
                </h3>
                
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
                    Recap Email Intelligente - {selectedPeriod === 'today' ? t.today : 
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
                                <p className="font-medium text-blue-900 text-sm">
                                  {email.category === 'business' ? '📋 Email Business' :
                                   email.category === 'promotion' ? '🎯 Promozione' :
                                   email.category === 'newsletter' ? '📰 Newsletter' : '📧 Email'}
                                </p>
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
              /* Vista dettaglio email */
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

        {/* Modal per generazione risposta */}
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

        {/* Modal risposta generata */}
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