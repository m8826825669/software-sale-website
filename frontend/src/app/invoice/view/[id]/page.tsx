import { getInvoice } from "@/lib/api"
import InvoicePreview from "@/components/InvoicePreview"

export default async function Page({ params }: any) {
  const invoice = await getInvoice(params.id)

  return (
    <div>
      <InvoicePreview invoice={invoice} />

      <button
        onClick={() =>
          window.open(`https://api.vexenlabs.com/api/invoice/${params.id}/pdf/`)
        }
      >
        Download PDF
      </button>
    </div>
  )
}