import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function Cart({ cart, setCart }) {
  const navegacao = useNavigate()
  
  const handleQuantityChange = (produtoId, novaQuantidade) => {
    if (novaQuantidade < 1) {
      setCart(cart.filter(item => item.id !== produtoId))
    } else {
      setCart(cart.map(item =>
        item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
      ))
    }
  }

  const handleRemoveItem = (produtoId) => {
    setCart(cart.filter(item => item.id !== produtoId))
  }

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantidade), 0)

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="text-gray-500">{item.description}</p>
              <p className="text-lg font-bold text-gray-900">R$ {Number(item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantidade - 1)}
                className="text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span className="px-4 py-2 border rounded">{item.quantidade}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantidade + 1)}
                className="text-gray-500 hover:text-gray-700"
              >
                +
              </button>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Continuar Comprando
        </Link>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            Subtotal: R$ {subtotal.toFixed(2)}
          </p>
          <button
            onClick={() => navegacao('/checkout')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  )
}