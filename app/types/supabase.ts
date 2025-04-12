export type Guest = {
  id: string
  name: string
  companions: number
  status: 'pending' | 'attending' | 'not_attending'
  created_at: string
  updated_at: string
}

export type Gift = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_reserved: boolean
  reserved_by: string | null
  created_at: string
  updated_at: string
} 