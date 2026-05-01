'use client'

import { useState } from 'react'

export default function InvoiceForm() {
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }])

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }])
  }

  return (
    <div>
      <h2>Create Invoice</h2>

      {items.map((item, index) => (
        <div key={index}>
          <input placeholder="Item" />
          <input type="number" placeholder="Qty" />
          <input type="number" placeholder="Price" />
        </div>
      ))}

      <button onClick={addItem}>Add Item</button>
      <button>Create Invoice</button>
    </div>
  )
}