
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { WindowDrawing } from '@/components/WindowDrawing';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrintInvoicePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const firestore = useFirestore();
  
  const docRef = useMemoFirebase(() => (id ? doc(firestore, 'invoices', id) : null), [firestore, id]);
  const { data: invoice, isLoading } = useDoc(docRef);

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse">GENERATING PRINT VIEW...</div>;
  if (!invoice) return <div className="p-20 text-center text-destructive font-bold">INVOICE DATA NOT FOUND.</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-accent/30">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden bg-slate-100 p-4 rounded-2xl border shadow-sm">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold hover:bg-white">
          <ArrowLeft className="h-4 w-4" /> BACK
        </Button>
        <Button onClick={() => window.print()} className="bg-black text-white hover:bg-black/90 gap-2 font-bold px-6">
          <Printer className="h-4 w-4" /> PRINT BILL
        </Button>
      </div>

      <div className="max-w-4xl mx-auto border-[3px] border-black p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-black text-white flex items-center justify-center -rotate-45 translate-x-12 -translate-y-12 font-black text-xs">
          ORIGINAL
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start border-b-[3px] border-black pb-8 mb-8 gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">AWAN ALUMINUM</h1>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Industrial Fabrication & Management</p>
            <div className="mt-6 space-y-1 text-xs font-medium">
              <p>Industrial Area, Sector 4-B</p>
              <p>Contact: +92 3XX XXXXXXX</p>
            </div>
          </div>
          <div className="md:text-right flex flex-col md:items-end">
            <div className="bg-black text-white px-4 py-2 mb-4 font-black uppercase text-xl inline-block">INVOICE</div>
            <p className="text-xs font-black uppercase opacity-40 mb-1">Invoice ID</p>
            <p className="font-mono font-bold text-lg mb-4">#{id?.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs font-black uppercase opacity-40 mb-1">Issue Date</p>
            <p className="font-bold">{invoice.date || '---'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">Billed To</h3>
            <p className="text-2xl font-black uppercase text-black">{invoice.customerName || "Walk-in Customer"}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3">Specification Breakdown</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="space-y-0.5"><p className="text-[8px] font-bold text-slate-500 uppercase">Configuration</p><p className="text-xs font-black">{invoice.type} • {invoice.palla} Palla</p></div>
              <div className="space-y-0.5"><p className="text-[8px] font-bold text-slate-500 uppercase">Quantity</p><p className="text-xs font-black">{invoice.qty} Units</p></div>
              <div className="space-y-0.5"><p className="text-[8px] font-bold text-slate-500 uppercase">Width</p><p className="text-xs font-black">{invoice.width} ft</p></div>
              <div className="space-y-0.5"><p className="text-[8px] font-bold text-slate-500 uppercase">Height</p><p className="text-xs font-black">{invoice.height} ft</p></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border-2 border-black p-6 flex flex-col items-center justify-center rounded-sm">
            <WindowDrawing width={Number(invoice.width)} height={Number(invoice.height)} type={invoice.type} className="scale-110" />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="border-l-[4px] border-black pl-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Glass Calculation</h4>
              <p className="text-3xl font-black leading-none">{invoice.glassSqFt} <span className="text-sm">SQFT</span></p>
            </div>
            <div className="border-l-[4px] border-black pl-6 opacity-80">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Industrial Standards</h4>
              <p className="text-xs font-bold leading-relaxed">Calculated using dynamic section formulas for Top, Bottom, and Side frame profiles.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="w-full border-[2px] border-black">
            <div className="bg-black text-white p-3 flex justify-between font-black text-xs uppercase tracking-widest">
              <span>Description</span>
              <span>Amount (PKR)</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-black/10">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase">Custom Window Fabrication</p>
                <p className="text-[10px] font-medium text-slate-500">Aluminum Profiles + Glass + Hardware + Labor</p>
              </div>
              <p className="font-black text-lg">PKR {Number(invoice.netAmount || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-8 border-t-[3px] border-black">
          <div className="max-w-xs">
            <h5 className="text-[10px] font-black uppercase mb-3">Notice:</h5>
            <p className="text-[9px] leading-relaxed font-medium text-slate-500 italic">* Computer-generated invoice. Please verify dimensions before installation.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Net Total Amount</p>
            <h2 className="text-6xl font-black tracking-tighter leading-none">PKR {Number(invoice.netAmount || 0).toLocaleString()}</h2>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-20">
          <div className="text-center"><div className="border-t-2 border-black pt-2 uppercase font-black text-[10px]">Customer Acknowledgement</div></div>
          <div className="text-center"><div className="border-t-2 border-black pt-2 uppercase font-black text-[10px]">Authorized Signature</div></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print-hidden { display: none !important; }
          @page { margin: 15mm; }
        }
      ` }} />
    </div>
  );
}
