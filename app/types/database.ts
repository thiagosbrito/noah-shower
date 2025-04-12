export type Guest = {
  id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  created_at: string
  updated_at: string
}

export type Gift = {
  id: string
  name: string
  description: string | null
  status: 'available' | 'reserved'
  created_at: string
  updated_at: string
}

export type GiftReservation = {
  id: string
  gift_id: string
  guest_id: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: Guest
        Insert: Omit<Guest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Guest, 'id' | 'created_at' | 'updated_at'>>
      }
      gifts: {
        Row: Gift
        Insert: Omit<Gift, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Gift, 'id' | 'created_at' | 'updated_at'>>
      }
      gift_reservations: {
        Row: GiftReservation
        Insert: Omit<GiftReservation, 'id' | 'created_at'>
        Update: never
      }
    }
  }
} 