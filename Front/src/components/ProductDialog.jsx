import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function ProductDialog({ isOpen, onClose, onSubmit, product, produtos = [] }) {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    preco: '',
    estoque: '',
    codigo: '',
    id: '',
    imagem: null,
    imagePreview: ''
  })
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (product) {
      setDadosFormulario({
        nome: product.nome || '',
        codigo: product.codigo || '',
        preco: product.preco?.toString() || '',
        estoque: product.estoque?.toString() || '',
        id: product.id || '',
        // image: null,
        imagePreview: product.imageUrl || ''
      })
      setErro('')
    } else {
      resetarFormulario()
    }
  }, [product])

  const resetarFormulario = () => {
    setDadosFormulario({
      nome: '',
      preco: '',
      codigo: '',
      estoque: '',
      id: '',
      imagem: null,
      imagePreview: ''
    })
    setErro('')
  }

  const handleImageChange = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setDadosFormulario({
        ...dadosFormulario,
        imagem: arquivo,
        imagePreview: URL.createObjectURL(arquivo)
      })
    }
  }

 const handleSubmit = (e) => {
  e.preventDefault()

  const produtoExistente = produtos?.find(p => p.codigo === dadosFormulario.codigo && p.id !== dadosFormulario.id)
  if (produtoExistente) {
    setErro('Já existe um produto com este código')
    return
  }

  const precoCorrigido = dadosFormulario.preco.replace(',', '.')

  const formData = new FormData()
  formData.append('Nome', dadosFormulario.nome)
  formData.append('Codigo', dadosFormulario.codigo)
  formData.append('Estoque', dadosFormulario.estoque.toString())
  formData.append('Preco', Number(precoCorrigido).toFixed(2).replace('.', ','))

  if (dadosFormulario.imagem) {
    formData.append('Imagem', dadosFormulario.imagem)
  }

  onSubmit(formData)
  resetarFormulario()
}


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {product ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID do Produto
                      </label>
                      <input
                        type="text"
                        value={dadosFormulario.codigo}
                        onChange={(e) => {
                          setDadosFormulario({ ...dadosFormulario, codigo: e.target.value })
                          setErro('')
                        }}
                        onBlur={() => {
                          const codigoLength = dadosFormulario.codigo.length
                          if (codigoLength < 8 || codigoLength > 14) {
                            setErro('O código deve ter entre 8 e 14 caracteres.')
                          }
                        }}
                        className={`input ${erro ? 'border-red-500 focus:ring-red-500' : ''}`}
                        required
                      />
                      {erro && (
                        <p className="mt-1 text-sm text-red-600">{erro}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Imagem
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-pink-50 file:text-pink-700
                          hover:file:bg-pink-100"
                      />
                      {dadosFormulario.imagePreview && (
                        <img
                          src={dadosFormulario.imagePreview}
                          alt="Prévia"
                          className="mt-2 h-32 w-full object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={dadosFormulario.nome}
                        onChange={(e) => setDadosFormulario({ ...dadosFormulario, nome: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preço (R$)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dadosFormulario.preco}
                        onChange={(e) => setDadosFormulario({ ...dadosFormulario, preco: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantidade em Estoque
                      </label>
                      <input
                        type="number"
                        value={dadosFormulario.estoque}
                        onChange={(e) => setDadosFormulario({ ...dadosFormulario, estoque: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        resetarFormulario()
                      }}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {product ? 'Salvar Alterações' : 'Adicionar Produto'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}