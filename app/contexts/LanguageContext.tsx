'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'pt-BR' | 'en'

export type TranslationKey = 
  | 'rsvp.title'
  | 'rsvp.subtitle'
  | 'rsvp.name'
  | 'rsvp.namePlaceholder'
  | 'rsvp.nameRequired'
  | 'rsvp.status'
  | 'rsvp.companions'
  | 'rsvp.companionsInvalid'
  | 'rsvp.submit'
  | 'rsvp.submitting'
  | 'rsvp.success'
  | 'rsvp.update'
  | 'rsvp.updated'
  | 'rsvp.received'
  | 'rsvp.attending'
  | 'rsvp.notAttending'
  | 'rsvp.attendingDesc'
  | 'rsvp.notAttendingDesc'
  | 'gifts.title'
  | 'gifts.subtitle'
  | 'gifts.available'
  | 'gifts.reserved'
  | 'gifts.reservedByYou'
  | 'gifts.reservedBySomeone'
  | 'gifts.unreserve'
  | 'gifts.reserve'
  | 'gifts.changedMind'
  | 'gifts.comingSoon'
  | 'gifts.checkBack'
  | 'hero.welcome'
  | 'hero.title'
  | 'hero.subtitle'
  | 'eventDetails.title'
  | 'eventDetails.date'
  | 'eventDetails.time'
  | 'eventDetails.location'
  | 'eventDetails.address'
  | 'eventDetails.city'
  | 'eventDetails.dateValue'
  | 'eventDetails.timeValue'
  | 'eventDetails.addressValue'
  | 'eventDetails.cityValue'
  | `gifts.${string}` // Allow dynamic gift keys

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  translateGift: (name: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

type Translations = Record<Language, Record<TranslationKey, string>>

// Default translations
const translations: Translations = {
  'en': {
    // Static content
    'rsvp.title': 'RSVP',
    'rsvp.subtitle': 'Please let us know if you can make it',
    'rsvp.name': 'Name',
    'rsvp.namePlaceholder': 'Enter your name',
    'rsvp.nameRequired': 'Name is required',
    'rsvp.status': 'Will you attend?',
    'rsvp.companions': 'Number of companions',
    'rsvp.companionsInvalid': 'Number of companions cannot be negative',
    'rsvp.submit': 'Submit RSVP',
    'rsvp.submitting': 'Saving...',
    'rsvp.success': 'RSVP Confirmed!',
    'rsvp.update': 'Update my RSVP',
    'rsvp.updated': "We've updated your RSVP status.",
    'rsvp.received': "We've received your RSVP. Thank you for confirming!",
    'rsvp.attending': "Yes, I'll be there!",
    'rsvp.notAttending': "Sorry, can't make it",
    'rsvp.attendingDesc': "I'm excited to celebrate this special moment",
    'rsvp.notAttendingDesc': "I'll be there in spirit",
    'gifts.title': 'Gift Registry',
    'gifts.subtitle': 'If you\'d like to bring a gift, we\'ve put together a wishlist of items that would be helpful. Your presence is the most important gift of all, but if you choose to bring something, we\'ll be delighted!',
    'gifts.available': 'Available',
    'gifts.reserved': 'Reserved',
    'gifts.reservedByYou': 'Reserved by you ❤️',
    'gifts.reservedBySomeone': 'Reserved by someone else',
    'gifts.unreserve': 'Unreserve',
    'gifts.reserve': 'Reserve',
    'gifts.changedMind': 'Changed your mind? No worries! Click below to unreserve.',
    'gifts.comingSoon': 'Gift Registry Coming Soon!',
    'gifts.checkBack': 'We\'re still preparing our gift wishlist. Please check back later!',
    // Hero section
    'hero.welcome': 'Welcome!',
    'hero.title': "to Noah's Wild Adventure",
    'hero.subtitle': "We're going on a jungle adventure to celebrate our little explorer on the way! 🌿🦁🐒",
    'eventDetails.title': 'Event Details',
    'eventDetails.date': 'Date',
    'eventDetails.time': 'Time',
    'eventDetails.location': 'Location',
    'eventDetails.address': 'Address',
    'eventDetails.city': 'City',
    'eventDetails.dateValue': 'Saturday, May 24th, 2025',
    'eventDetails.timeValue': 'Starting at 15:00',
    'eventDetails.addressValue': 'Gromadzka 63/5',
    'eventDetails.cityValue': 'Krakow',
    'gifts.diaperM': 'Disposable diaper',
    'gifts.diaperP': 'Disposable diaper',
    'gifts.diaperWipesM': 'Disposable diaper + Fragrance-free wipes',
    'gifts.diaperWipesP': 'Disposable diaper + Fragrance-free wipes',
    'gifts.wipesCream': 'Wipes + Diaper cream',
    'gifts.moisturizer': 'Body moisturizer',
    'gifts.bodyWash': 'Body wash (head to toe)',
    'gifts.brushComb': 'Brush and comb set',
    'gifts.nailClipper': 'Nail clipper or scissors',
    'gifts.pacifier': 'Nuk Mommy Feel pacifier',
    'gifts.smallBottle': 'Small bottle',
    'gifts.newbornBottle': 'Newborn bottle',
    'gifts.bottleBrush': 'Bottle brush',
    'gifts.diaperBin': 'Odor-proof diaper bin',
    'gifts.activityMat': 'Activity mat',
    'gifts.babyCarrier': 'Baby carrier/Sling',
    'gifts.nasalAspirator': 'Nasal aspirator',
    'gifts.pacifierClip': 'Pacifier clip',
    'gifts.sensoryToys': 'Cloth books or sensory toys',
    'gifts.bottleSterilizer': 'Bottle sterilizer',
  },
  'pt-BR': {
    // Static content
    'rsvp.title': 'Confirme sua Presença',
    'rsvp.subtitle': 'Por favor, nos avise se você poderá comparecer',
    'rsvp.name': 'Nome',
    'rsvp.namePlaceholder': 'Digite seu nome',
    'rsvp.nameRequired': 'Nome é obrigatório',
    'rsvp.status': 'Você comparecerá?',
    'rsvp.companions': 'Número de acompanhantes',
    'rsvp.companionsInvalid': 'Número de acompanhantes não pode ser negativo',
    'rsvp.submit': 'Confirmar Presença',
    'rsvp.submitting': 'Salvando...',
    'rsvp.success': 'Presença Confirmada!',
    'rsvp.update': 'Atualizar minha Confirmação',
    'rsvp.updated': 'Atualizamos seu status de presença.',
    'rsvp.received': 'Recebemos sua confirmação. Obrigado por confirmar!',
    'rsvp.attending': 'Sim, estarei lá!',
    'rsvp.notAttending': 'Desculpe, não poderei comparecer',
    'rsvp.attendingDesc': 'Estou animado para celebrar este momento especial',
    'rsvp.notAttendingDesc': 'Estarei presente em pensamento',
    'gifts.title': 'Lista de Presentes',
    'gifts.subtitle': 'Se você gostaria de trazer um presente, preparamos uma lista de itens que seriam úteis. Sua presença é o presente mais importante de todos, mas se você escolher trazer algo, ficaremos encantados!',
    'gifts.available': 'Disponível',
    'gifts.reserved': 'Reservado',
    'gifts.reservedByYou': 'Reservado por você ❤️',
    'gifts.reservedBySomeone': 'Reservado por outra pessoa',
    'gifts.unreserve': 'Cancelar Reserva',
    'gifts.reserve': 'Reservar',
    'gifts.changedMind': 'Mudou de ideia? Sem problemas! Clique abaixo para cancelar a reserva.',
    'gifts.comingSoon': 'Lista de Presentes em Breve!',
    'gifts.checkBack': 'Ainda estamos preparando nossa lista de presentes. Por favor, volte mais tarde!',
    // Hero section
    'hero.welcome': 'Bem-vindo!',
    'hero.title': 'à Aventura Selvagem do Noah',
    'hero.subtitle': 'Vamos em uma aventura na selva para celebrar nosso pequeno explorador a caminho! 🌿🦁🐒',
    'eventDetails.title': 'Detalhes do Evento',
    'eventDetails.date': 'Data',
    'eventDetails.time': 'Horário',
    'eventDetails.location': 'Local',
    'eventDetails.address': 'Endereço',
    'eventDetails.city': 'Cidade',
    'eventDetails.dateValue': 'Sábado, 24 de Maio de 2025',
    'eventDetails.timeValue': 'Começando às 15:00',
    'eventDetails.addressValue': 'Gromadzka 63/5',
    'eventDetails.cityValue': 'Cracóvia',
    'gifts.diaperM': 'Fralda descartável',
    'gifts.diaperP': 'Fralda descartável',
    'gifts.diaperWipesM': 'Fralda descartável + Lenço umedecido (sem fragrância)',
    'gifts.diaperWipesP': 'Fralda descartável + Lenço umedecido (sem fragrância)',
    'gifts.wipesCream': 'Lenço umedecido + Pomada para assadura',
    'gifts.moisturizer': 'Hidratante corporal',
    'gifts.bodyWash': 'Sabonete líquido (cabeça aos pés)',
    'gifts.brushComb': 'Kit escova e pente',
    'gifts.nailClipper': 'Cortador de unha ou tesourinha',
    'gifts.pacifier': 'Chupeta Nuk Mommy Feel',
    'gifts.smallBottle': 'Mamadeira pequena',
    'gifts.newbornBottle': 'Mamadeira RN',
    'gifts.bottleBrush': 'Escova de mamadeira',
    'gifts.diaperBin': 'Lixeira anti odor',
    'gifts.activityMat': 'Tapete de atividades',
    'gifts.babyCarrier': 'Canguru/Sling',
    'gifts.nasalAspirator': 'Aspirador nasal',
    'gifts.pacifierClip': 'Prendedor de chupeta',
    'gifts.sensoryToys': 'Livrinhos de pano ou brinquedos sensoriais',
    'gifts.bottleSterilizer': 'Esterilizador de mamadeira',
  }
}

// Common translations for gift names
const giftTranslations: Record<Language, Record<string, string>> = {
  'en': {
    'Fralda descartável': 'Disposable diaper',
    'Lenço umedecido': 'Fragrance-free wipes',
    'Pomada para assadura': 'Diaper cream',
    'Hidratante corporal': 'Body moisturizer',
    'Sabonete líquido': 'Body wash',
    'Kit escova e pente': 'Brush and comb set',
    'Cortador de unha': 'Nail clipper',
    'tesourinha': 'scissors',
    'Chupeta': 'Pacifier',
    'Mamadeira': 'Bottle',
    'Escova de mamadeira': 'Bottle brush',
    'Lixeira anti odor': 'Odor-proof diaper bin',
    'Tapete de atividades': 'Activity mat',
    'Canguru': 'Baby carrier',
    'Sling': 'Sling',
    'Aspirador nasal': 'Nasal aspirator',
    'Prendedor de chupeta': 'Pacifier clip',
    'Livrinhos de pano': 'Cloth books',
    'brinquedos sensoriais': 'sensory toys',
    'Esterilizador de mamadeira': 'Bottle sterilizer',
    'pequena': 'small',
    'RN': 'newborn',
    'Tamanho M': 'Size M',
    'Tamanho P': 'Size P',
    'sem fragrância': 'fragrance-free',
    'cabeça aos pés': 'head to toe',
  },
  'pt-BR': {
    // Portuguese translations are the same as the original text
    'Disposable diaper': 'Fralda descartável',
    'Fragrance-free wipes': 'Lenço umedecido (sem fragrância)',
    'Diaper cream': 'Pomada para assadura',
    'Body moisturizer': 'Hidratante corporal',
    'Body wash': 'Sabonete líquido',
    'Brush and comb set': 'Kit escova e pente',
    'Nail clipper': 'Cortador de unha',
    'scissors': 'tesourinha',
    'Pacifier': 'Chupeta',
    'Bottle': 'Mamadeira',
    'Bottle brush': 'Escova de mamadeira',
    'Odor-proof diaper bin': 'Lixeira anti odor',
    'Activity mat': 'Tapete de atividades',
    'Baby carrier': 'Canguru',
    'Sling': 'Sling',
    'Nasal aspirator': 'Aspirador nasal',
    'Pacifier clip': 'Prendedor de chupeta',
    'Cloth books': 'Livrinhos de pano',
    'sensory toys': 'brinquedos sensoriais',
    'Bottle sterilizer': 'Esterilizador de mamadeira',
    'small': 'pequena',
    'newborn': 'RN',
    'Size M': 'Tamanho M',
    'Size P': 'Tamanho P',
    'fragrance-free': 'sem fragrância',
    'head to toe': 'cabeça aos pés',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt-BR')

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('noah_shower_language')
    if (savedLanguage && (savedLanguage === 'pt-BR' || savedLanguage === 'en')) {
      setLanguage(savedLanguage as Language)
    } else {
      // Default to browser language if available, otherwise PT-BR
      const browserLang = navigator.language
      setLanguage(browserLang.startsWith('pt') ? 'pt-BR' : 'en')
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('noah_shower_language', lang)
  }

  const t = (key: TranslationKey) => {
    return translations[language][key]
  }

  const translateGift = (name: string): string => {
    if (language === 'pt-BR') return name // If in Portuguese, return original text

    // For English, translate each part of the name
    let translatedName = name
    for (const [pt, en] of Object.entries(giftTranslations['en'])) {
      translatedName = translatedName.replace(new RegExp(pt, 'gi'), en)
    }
    return translatedName
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translateGift }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 