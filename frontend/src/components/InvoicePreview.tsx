export default function InvoicePreview({ invoice }: any) {
  return (
    <div>
      <h1>Invoice {invoice.invoice_number}</h1>
      <p>Client: {invoice.client}</p>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any, i: number) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: {invoice.total}</h3>
    </div>
  )
}