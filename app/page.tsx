import { Metadata } from 'next'
import ClientHome from './components/ClientHome'

export const metadata: Metadata = {
  title: "Noah's Baby Shower",
  description: "Join us for Noah's jungle adventure baby shower celebration!"
}

export default function Home() {
  return <ClientHome />
}

