'use client'

import { useState } from 'react'

export default function Products() {
  const [activeTab, setActiveTab] = useState<'perkins' | 'cummins'>('perkins')

  const perkinsProducts = [
    {
      id: 1,
      name: 'PERKINS 1104D-44TA',
      power: '100-150 kVA',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80',
      features: ['4 Cylinders', 'Water Cooled', 'Digital Control System', '2 Year Warranty'],
      price: 'Available',
    },
    {
      id: 2,
      name: 'PERKINS 4006-23TRG1',
      power: '200-300 kVA',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      features: ['6 Cylinders', 'Water Cooled', 'Advanced Protection System', '2 Year Warranty'],
      price: 'Available',
    },
    {
      id: 3,
      name: 'PERKINS 4012-46TRS2',
      power: '500-750 kVA',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      features: ['12 Cylinders', 'Water Cooled', 'Integrated Management System', '2 Year Warranty'],
      price: 'Available',
    },
  ]

  const cumminsProducts = [
    {
      id: 1,
      name: 'CUMMINS QSB6.7',
      power: '150-200 kVA',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80',
      features: ['6 Cylinders', 'Water Cooled', 'SCR Technology', '3 Year Warranty'],
      price: 'Available',
    },
    {
      id: 2,
      name: 'CUMMINS QSL9',
      power: '300-450 kVA',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      features: ['6 Cylinders', 'Water Cooled', 'PowerCommand System', '3 Year Warranty'],
      price: 'Available',
    },
    {
      id: 3,
      name: 'CUMMINS QSK60',
      power: '1000-1500 kVA',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      features: ['16 Cylinders', 'Water Cooled', 'Advanced Management System', '3 Year Warranty'],
      price: 'Available',
    },
  ]

  const products = activeTab === 'perkins' ? perkinsProducts : cumminsProducts

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive range of high-quality generators to meet all your needs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('perkins')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'perkins'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              PERKINS
            </button>
            <button
              onClick={() => setActiveTab('cummins')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'cummins'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              CUMMINS
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.power}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <ul className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-blue-600 font-semibold text-lg">
                    {product.price}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

