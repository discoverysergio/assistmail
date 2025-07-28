import './globals.css'

export const metadata = {
  title: 'AssistMail | AI Email Assistant for Smart Business Communication',
  description: 'Track decisions, generate intelligent replies, and boost email productivity with AI-powered AssistMail. Supports 20+ languages.',
  keywords: 'email assistant, AI, decision tracking, smart replies, productivity, business intelligence, multilingual',
  author: 'Sergio Brizzo - Across Digital Solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
