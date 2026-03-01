
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { WindowDrawing } from '@/components/WindowDrawing';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * PrintContent handles the actual logic of fetching and displaying the invoice.
 * Wrapped in Suspense to prevent Internal Server Errors during static export.
 */
function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const firestore = useFirestore();
  
  const docRef = useMemoFirebase(() => (id ? doc(firestore, 'invoices', id) : null), [firestore, id]);
  const { data: invoice, isLoading } = useDoc(docRef);

  if (!id) return <div className="p-20 text-center text-destructive font-bold uppercase tracking-widest">ERROR: NO INVOICE ID PROVIDED.</div>;
  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-2xl uppercase tracking-widest">GENERATING INDUSTRIAL PRINT VIEW...</div>;
  if (!invoice) return <div className="p-20 text-center text-destructive font-bold uppercase">INVOICE DATA NOT FOUND IN CLOUD.</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-accent/30">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden bg-slate-100 p-4 rounded-2xl border shadow-sm">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold hover:bg-white text-black">
          <ArrowLeft className="h-4 w-4" /> BACK
        </Button>
        <Button onClick={() => window.print()} className="bg-black text-white hover:bg-black/90 gap-2 font-bold px-6 shadow-lg">
          <Printer className="h-4 w-4" /> PRINT OFFICIAL BILL
        </Button>
      </div>

      <div className="max-w-4xl mx-auto border-[4px] border-black p-8 md:p-12 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-black text-white flex items-center justify-center -rotate-45 translate-x-12 -translate-y-12 font-black text-xs">
          ORIGINAL
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start border-b-[4px] border-black pb-8 mb-8 gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2 text-black">AWAN ALUMINUM</h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Industrial Fabrication & Management</p>
            <div className="mt-6 space-y-1 text-xs font-bold text-black">
              <p>Main Industrial Area, Sector 4-B, Karachi</p>
              <p>Contact: +92 3XX XXXXXXX</p>
              <p>NTN: XXX-XXXXXX-X</p>
            </div>
          </div>
          <div className="md:text-right flex flex-col md:items-end">
            <div className="bg-black text-white px-6 py-2 mb-4 font-black uppercase text-2xl inline-block">
              INVOICE
            </div>
            <p className="text-[10px] font-black uppercase opacity-40 mb-1">Invoice Number</p>
            <p className="font-mono font-black text-xl mb-4 text-black">{invoice.invoiceNumber || `ID-${id.slice(0, 6).toUpperCase()}`}</p>
            <p className="text-[10px] font-black uppercase opacity-40 mb-1">Issue Date</p>
            <p className="font-black text-lg text-black">{invoice.date || '---'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 border-b-2 border-black/10 pb-1">Billed To</h3>
              <p className="text-3xl font-black uppercase text-black">{invoice.customerName || "Walk-in Customer"}</p>
            </div>
            <div className="p-4 bg-slate-50 border-2 border-black/5 rounded-xl">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">System Reference</p>
              <p className="font-mono text-xs font-bold text-slate-600">{id}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border-4 border-black shadow-2xl text-white">
            <h3 className="text-[10px] font-black uppercase text-accent mb-4 tracking-widest">Configuration Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase">Window Type</p>
                <p className="text-sm font-black">{invoice.type} • {invoice.palla} Palla</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase">Total Quantity</p>
                <p className="text-sm font-black">{invoice.qty} Units</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase">Width (ft)</p>
                <p className="text-sm font-black">{invoice.width}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase">Height (ft)</p>
                <p className="text-sm font-black">{invoice.height}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border-4 border-black p-8 flex flex-col items-center justify-center rounded-sm shadow-inner relative">
            <WindowDrawing width={Number(invoice.width)} height={Number(invoice.height)} type={invoice.type} className="scale-125" />
            <div className="absolute bottom-2 right-2 text-[8px] font-black opacity-20 uppercase tracking-tighter">Scale Drawing</div>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <div className="border-l-[6px] border-black pl-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Glass Area</h4>
              <p className="text-5xl font-black leading-none text-black">{invoice.glassSqFt} <span className="text-base">SQFT</span></p>
              <p className="text-[10px] font-bold text-slate-500 mt-2">Calculated for {invoice.qty} individual units.</p>
            </div>
            <div className="border-l-[6px] border-accent pl-6 bg-accent/5 py-4 pr-4 rounded-r-xl">
              <h4 className="text-[10px] font-black uppercase text-accent mb-1">Industrial Logic</h4>
              <p className="text-xs font-bold leading-relaxed text-black/80 italic">"Precision calculated using dynamic section formulas for Top, Bottom, and Side profiles as configured in the Awan Master System."</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="w-full border-[4px] border-black">
            <div className="bg-black text-white p-4 flex justify-between font-black text-xs uppercase tracking-[0.2em]">
              <span>Description of Goods & Services</span>
              <span>Amount (PKR)</span>
            </div>
            <div className="p-6 flex justify-between items-center border-b-2 border-black/10">
              <div className="space-y-1">
                <p className="font-black text-lg uppercase text-black">Professional Window Fabrication</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aluminum Profiles + Glass + Hardware + Labor</p>
              </div>
              <p className="font-black text-2xl text-black">PKR {Number(invoice.netAmount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-8 border-t-[4px] border-black">
          <div className="max-w-sm">
            <h5 className="text-[10px] font-black uppercase mb-3 text-black">Important Notice:</h5>
            <p className="text-[9px] leading-relaxed font-bold text-slate-500 italic uppercase">
              * This is a computer-generated invoice based on Awan industrial algorithms. Please verify all dimensions before site installation. The company is not responsible for errors in provided sizes.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Grand Total Amount</p>
            <h2 className="text-7xl font-black tracking-tighter leading-none text-black">PKR {Number(invoice.netAmount).toLocaleString()}</h2>
            <div className="mt-4 flex items-center justify-end gap-2 text-green-600">
              <div className="h-3 w-3 rounded-full bg-green-600 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">Fully Settled / Paid</p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-24">
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 uppercase font-black text-[10px] tracking-widest">Customer Acknowledgement</div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 uppercase font-black text-[10px] tracking-widest">Authorized Signature</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; color: black !important; }
          .print-hidden { display: none !important; }
          @page { margin: 10mm; }
          .max-w-4xl { border: 4px solid black !important; }
        }
      ` }} />
    </div>
  );
}

export default function PrintInvoicePage() {
  return (
    <React.Suspense fallback={<div className="p-20 text-center font-black animate-pulse uppercase tracking-widest">LOADING INDUSTRIAL PRINT ENGINE...</div>}>
      <PrintContent />
    </React.Suspense>
  );
}
