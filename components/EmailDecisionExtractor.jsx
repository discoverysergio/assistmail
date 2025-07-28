'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Calendar, Search, ExternalLink, Reply, FileText, Filter, Clock, User } from 'lucide-react'

const EmailDecisionExtractor = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyInstructions, setReplyInstructions] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  // Supported languages
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

  // Translations
  const translations = {
    en: {
      title: 'AssistMail',
      subtitle: 'AI Email Assistant for Smart Business Communication',
      connectedTo: 'Connected to:',
      addAccount: 'Add another account...',
      secure: 'Secure',
      analysisFilters: 'Analysis Filters',
      period: 'Period',
      today: 'Today',
      yesterday: 'Yesterday',
      lastWeek: 'Last week',
      lastMonth: 'Last month',
      customPeriod: 'Custom period',
      fromSpecificPerson: 'From specific person',
      allPeople: 'All people',
      emailStatus: 'Email status',
      allEmails: 'All emails',
      unreadOnly: 'Unread only',
      readOnly: 'Read only',
      importantOnly: 'Important only',
      decisionType: 'Decision type',
      budget: 'Budget/Finance',
      hiring: 'Hiring',
      strategy: 'Strategy',
      operational: 'Operations',
      filteredStats: 'Filtered stats',
      decisionsFound: 'Decisions found:',
      pendingConfirmation: 'Pending confirmation:',
      implemented: 'Implemented:',
      securityGuaranteed: 'Security Guaranteed',
      endToEndEncryption: '✓ End-to-end encrypted connection',
      noServerStorage: '✓ No email storage on our servers',
      localProcessing: '✓ Local processing when possible',
      readOnlyAccess: '✓ Read-only access to emails',
      iso27001: '✓ ISO 27001 certified',
      aiLearningStatus: 'AI Learning Status',
      emailsAnalyzed: 'Emails analyzed:',
      styleLeaned: 'Style learned:',
      aiLearningDescription: 'The system is learning your communication style by analyzing your email history.',
      decisionsRecap: 'Decisions Recap',
      noDecisionsFound: 'No decisions identified for this period',
      identifiedDecision: '🎯 Identified decision:',
      context: 'Context:',
      participants: 'Participants:',
      readFullThread: 'Read full thread',
      generateReply: 'Generate reply',
      backToRecap: '← Back to recap',
      from: 'From:',
      extractedDecision: '🎯 Decision extracted from thread:',
      generateAiReply: 'Generate AI reply',
      generatingReply: 'Generating reply...',
      analyzingThread: 'Analyzing thread and creating a reply in your style',
      replyGenerated: 'Reply Generated',
      additionalInstructions: 'Additional instructions (optional):',
      instructionsPlaceholder: 'e.g. Add specific deadline, More formal tone, Include budget details...',
      aiStyleConfidence: '💡 AI learned your style from 2,847 analyzed emails (87% confidence)',
      cancel: 'Cancel',
      copyReply: 'Copy reply',
      sendEmail: 'Send email',
      decided: 'Decided',
      pending: 'Pending',
      inProgress: 'In progress',
      high: 'high',
      medium: 'medium',
      low: 'low'
    },
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
      aiStyleConfidence: '💡 L\'IA ha appreso il tuo stile da 2.847 email analizzate (87% di confidenza)',
      cancel: 'Annulla',
      copyReply: 'Copia risposta',
      sendEmail: 'Invia email',
      decided: 'Deciso',
      pending: 'In attesa',
      inProgress: 'In corso',
      high: 'alta',
      medium: 'media',
      low: 'bassa'
    },
    es: {
      title: 'AssistMail',
      subtitle: 'Asistente de Email IA para Comunicación Empresarial Inteligente',
      connectedTo: 'Conectado a:',
      addAccount: 'Agregar otra cuenta...',
      secure: 'Seguro',
      analysisFilters: 'Filtros de Análisis',
      period: 'Período',
      today: 'Hoy',
      yesterday: 'Ayer',
      lastWeek: 'Última semana',
      lastMonth: 'Último mes',
      customPeriod: 'Período personalizado',
      fromSpecificPerson: 'De persona específica',
      allPeople: 'Todas las personas',
      emailStatus: 'Estado del email',
      allEmails: 'Todos los emails',
      unreadOnly: 'Solo no leídos',
      readOnly: 'Solo leídos',
      importantOnly: 'Solo importantes',
      decisionType: 'Tipo de decisión',
      budget: 'Presupuesto/Finanzas',
      hiring: 'Contrataciones',
      strategy: 'Estrategia',
      operational: 'Operaciones',
      filteredStats: 'Estadísticas filtradas',
      decisionsFound: 'Decisiones encontradas:',
      pendingConfirmation: 'Pendientes de confirmación:',
      implemented: 'Implementadas:',
      securityGuaranteed: 'Seguridad Garantizada',
      endToEndEncryption: '✓ Conexión cifrada end-to-end',
      noServerStorage: '✓ Sin almacenamiento de emails en nuestros servidores',
      localProcessing: '✓ Procesamiento local cuando sea posible',
      readOnlyAccess: '✓ Acceso solo de lectura a emails',
      iso27001: '✓ Certificado ISO 27001',
      aiLearningStatus: 'Estado de Aprendizaje IA',
      emailsAnalyzed: 'Emails analizados:',
      styleLeaned: 'Estilo aprendido:',
      aiLearningDescription: 'El sistema está aprendiendo tu estilo de comunicación analizando tu historial de emails.',
      decisionsRecap: 'Resumen de Decisiones',
      noDecisionsFound: 'No se identificaron decisiones para este período',
      identifiedDecision: '🎯 Decisión identificada:',
      context: 'Contexto:',
      participants: 'Participantes:',
      readFullThread: 'Leer hilo completo',
      generateReply: 'Generar respuesta',
      backToRecap: '← Volver al resumen',
      from: 'De:',
      extractedDecision: '🎯 Decisión extraída del hilo:',
      generateAiReply: 'Generar respuesta IA',
      generatingReply: 'Generando respuesta...',
      analyzingThread: 'Analizando el hilo y creando una respuesta en tu estilo',
      replyGenerated: 'Respuesta Generada',
      additionalInstructions: 'Instrucciones adicionales (opcional):',
      instructionsPlaceholder: 'ej. Agregar fecha límite específica, Tono más formal, Incluir detalles de presupuesto...',
      aiStyleConfidence: '💡 La IA aprendió tu estilo de 2,847 emails analizados (87% de confianza)',
      cancel: 'Cancelar',
      copyReply: 'Copiar respuesta',
      sendEmail: 'Enviar email',
      decided: 'Decidido',
      pending: 'Pendiente',
      inProgress: 'En progreso',
      high: 'alta',
      medium: 'media',
      low: 'baja'
    }
  }

  const t = translations[selectedLanguage] || translations.en

  // Mock data adaptable to language
  const mockEmails = {
    today: [
      {
        id: 1,
        subject: selectedLanguage === 'it' ? "Budget Q4 - Decisione finale" : 
                 selectedLanguage === 'es' ? "Presupuesto Q4 - Decisión final" :
                 "Q4 Budget - Final Decision",
        sender: "matteo.accardo@syneton.it",
        time: "14:30",
        priority: "high",
        decision: selectedLanguage === 'it' ? "Approvato budget aggiuntivo di 50K€ per espansione team" :
                  selectedLanguage === 'es' ? "Aprobado presupuesto adicional de 50K€ para expansión del equipo" :
                  "Additional €50K budget approved for team expansion",
        context: selectedLanguage === 'it' ? "Thread di 8 email da lunedì scorso" :
                 selectedLanguage === 'es' ? "Hilo de 8 emails desde el lunes pasado" :
                 "Thread of 8 emails since last Monday",
        keyParticipants: ["M. Accardo", "S. Brizzo", "Finance Team"],
        status: "decided",
        content: selectedLanguage === 'it' ? "Ciao Sergio, dopo l'analisi approfondita dei numeri Q3 e le proiezioni Q4, decidiamo di approvare il budget aggiuntivo di 50.000€ per l'espansione del team. I margini migliorati ci permettono questo investimento. Procediamo con le assunzioni programmate. Matteo" :
                 selectedLanguage === 'es' ? "Hola Sergio, después del análisis profundo de los números Q3 y las proyecciones Q4, decidimos aprobar el presupuesto adicional de 50.000€ para la expansión del equipo. Los márgenes mejorados nos permiten esta inversión. Procedemos con las contrataciones programadas. Matteo" :
                 "Hi Sergio, after the in-depth analysis of Q3 numbers and Q4 projections, we decide to approve the additional budget of €50,000 for team expansion. The improved margins allow us this investment. We proceed with the planned hires. Matteo"
      },
      {
        id: 2,
        subject: selectedLanguage === 'it' ? "Meeting con cliente MetLife - next steps" :
                 selectedLanguage === 'es' ? "Reunión con cliente MetLife - próximos pasos" :
                 "MetLife client meeting - next steps",
        sender: "roella@across.it",
        time: "11:15",
        priority: "medium",
        decision: selectedLanguage === 'it' ? "Attivazione 20 operatori aggiuntivi entro fine mese" :
                  selectedLanguage === 'es' ? "Activación de 20 operadores adicionales para fin de mes" :
                  "Activation of 20 additional operators by month-end",
        context: selectedLanguage === 'it' ? "Thread di 4 email da ieri" :
                 selectedLanguage === 'es' ? "Hilo de 4 emails desde ayer" :
                 "Thread of 4 emails since yesterday",
        keyParticipants: ["Roella", "C. Sanna", "MetLife team"],
        status: "pending_confirmation",
        content: selectedLanguage === 'it' ? "Sergio, il meeting con MetLife è andato benissimo. Hanno richiesto di attivare 20 operatori aggiuntivi per il progetto Telepass entro fine mese. Ho stimato i costi e la fattibilità. Aspetto conferma per procedere con le assunzioni express a Lecce." :
                 selectedLanguage === 'es' ? "Sergio, la reunión con MetLife fue excelente. Han solicitado activar 20 operadores adicionales para el proyecto Telepass para fin de mes. He estimado los costos y la factibilidad. Espero confirmación para proceder con las contrataciones express en Lecce." :
                 "Sergio, the MetLife meeting went very well. They've requested to activate 20 additional operators for the Telepass project by month-end. I've estimated costs and feasibility. Waiting for confirmation to proceed with express hires in Lecce."
      }
    ]
  }

  const currentEmails = mockEmails[selectedPeriod] || []

  const generateReply = (email) => {
    setIsGeneratingReply(true)
    
    // Simula generazione risposta AI
    setTimeout(() => {
      let reply = ""
      
      if (email.id === 1) {
        reply = selectedLanguage === 'it' ? 
          `Ciao Matteo,

perfetto, procediamo con l'approvazione dei 50K€ per l'espansione team.

Considerando i margini Q3 e le proiezioni Q4, l'investimento è strategicamente corretto.

Prossimi step:
- Attivazione immediate hiring per le posizioni identificate
- Timeline: assunzioni completate entro fine mese
- Reporting settimanale sui progressi

${replyInstructions ? `\n[Personalizzato]: ${replyInstructions}` : ''}

Grazie mille
Sergio` :
selectedLanguage === 'es' ?
`Hola Matteo,

perfecto, procedemos con la aprobación de los 50K€ para la expansión del equipo.

Considerando los márgenes Q3 y las proyecciones Q4, la inversión es estratégicamente correcta.

Próximos pasos:
- Activación de contratación inmediata para las posiciones identificadas
- Timeline: contrataciones completadas para fin de mes
- Reporte semanal sobre el progreso

${replyInstructions ? `\n[Personalizado]: ${replyInstructions}` : ''}

Saludos
Sergio` :
`Hi Matteo,

perfect, let's proceed with the €50K approval for team expansion.

Considering Q3 margins and Q4 projections, this investment is strategically sound.

Next steps:
- Activate immediate hiring for identified positions
- Timeline: hires completed by month-end
- Weekly progress reporting

${replyInstructions ? `\n[Custom]: ${replyInstructions}` : ''}

Best regards
Sergio`
      } else {
        reply = `[${t.replyGenerated}]

${replyInstructions ? replyInstructions : t.analyzingThread}

[${t.aiStyleConfidence}]`
      }
      
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
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{t.connectedTo}</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>sergio.brizzo@across.it</option>
                  <option>{t.addAccount}</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">{t.secure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar - Filtri avanzati */}
          <div className="lg:col-span-1">
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
                    { key: 'today', label: t.today, count: 2 },
                    { key: 'yesterday', label: t.yesterday, count: 1 },
                    { key: 'week', label: t.lastWeek, count: 4 },
                    { key: 'month', label: t.lastMonth, count: 12 },
                    { key: 'custom', label: t.customPeriod, count: 0 }
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
                        {period.count > 0 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {period.count}
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
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <option value="">{t.allPeople}</option>
                  <option value="matteo.accardo@syneton.it">Matteo Accardo (CFO)</option>
                  <option value="roella@across.it">Roella (Call Center)</option>
                  <option value="giorgio.brizzo@yoyomove.it">Giorgio Brizzo (Yoyomove)</option>
                </select>
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
                        defaultChecked={status.key === 'all'}
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
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.pendingConfirmation}</span>
                    <span className="font-medium text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.implemented}</span>
                    <span className="font-medium text-green-600">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pannello Sicurezza */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                🔒 {t.securityGuaranteed}
              </h4>
              <div className="text-xs text-green-700 space-y-1">
                <p>{t.endToEndEncryption}</p>
                <p>{t.noServerStorage}</p>
                <p>{t.localProcessing}</p>
                <p>{t.readOnlyAccess}</p>
                <p>{t.iso27001}</p>
              </div>
            </div>

            {/* Pannello Learning dello Stile */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                🤖 {t.aiLearningStatus}
              </h4>
              <div className="text-xs text-blue-700 space-y-2">
                <div className="flex justify-between">
                  <span>{t.emailsAnalyzed}</span>
                  <span className="font-medium">2.847</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.styleLeaned}</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
                <p className="text-xs mt-2">{t.aiLearningDescription}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!selectedEmail ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t.decisionsRecap} - {selectedPeriod === 'today' ? t.today : 
                                      selectedPeriod === 'yesterday' ? t.yesterday : 
                                      selectedPeriod === 'week' ? t.lastWeek : t.lastMonth}
                  </h2>
                  
                  {currentEmails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{t.noDecisionsFound}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentEmails.map((email) => (
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
                      <p className="text-gray-800 whitespace-pre-line">{selectedEmail.content}</p>
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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