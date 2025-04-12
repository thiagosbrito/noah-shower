'use client'

import { useState } from 'react'
import GuestList from '../components/GuestList'
import GiftList from '../components/GiftList'
import AddGiftForm from '../components/AddGiftForm'
import { FaUser, FaGift } from 'react-icons/fa'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'guests' | 'gifts'>('guests')

  return (
    <main className="min-h-screen bg-gray-900 py-8 text-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-pink-400 mb-8 font-sour-gummy">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'guests'
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaUser />
            <span>Guests</span>
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'gifts'
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaGift />
            <span>Gifts</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          {activeTab === 'guests' ? (
            <div>
              <h2 className="text-2xl font-bold text-pink-400 mb-6">Guest List</h2>
              <GuestList />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-pink-400 mb-6">Gift Registry</h2>
              <div className="mb-8">
                <AddGiftForm onGiftAdded={() => {}} />
              </div>
              <GiftList />
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 