import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, QrCode } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { buttonVariants } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";

interface Code {
  label: string;
  url: string;
  dataUrl: string;
}

export function QrCodesPage() {
  useDocumentTitle("QR codes");
  const [count, setCount] = useState(restaurant.dineIn.tableCount);
  const [codes, setCodes] = useState<Code[]>([]);

  useEffect(() => {
    // QRs point at whatever origin serves the app — so they work locally now and
    // on the live URL once deployed. Print them from the deployed site.
    const origin = window.location.origin;
    const param = restaurant.dineIn.tableParam;

    const targets = [
      ...Array.from({ length: Math.max(0, count) }, (_, i) => ({
        label: `Table ${i + 1}`,
        url: `${origin}/menu?${param}=${i + 1}`,
      })),
      { label: "Takeaway", url: `${origin}/menu` },
    ];

    let active = true;
    Promise.all(
      targets.map(async (t) => ({
        ...t,
        dataUrl: await QRCode.toDataURL(t.url, { width: 512, margin: 1 }),
      }))
    ).then((result) => {
      if (active) setCodes(result);
    });
    return () => {
      active = false;
    };
  }, [count]);

  return (
    <div>
      {/* Controls — hidden when printing */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="eyebrow">Table QR codes</p>
          <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink">
            Print &amp; place on tables
          </h2>
          <p className="mt-1 text-sm text-muted">
            Each code opens the menu with its table pre-filled. Print from your live site
            so the codes point to the deployed URL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink">
            Tables
            <input
              type="number"
              min={0}
              max={99}
              value={count}
              onChange={(e) => setCount(Math.max(0, Math.min(99, Number(e.target.value) || 0)))}
              className="w-20 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink"
            />
          </label>
          <button type="button" onClick={() => window.print()} className={buttonVariants({ size: "md" })}>
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {codes.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted print:hidden">
          <QrCode className="h-5 w-5" /> Generating…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 print:grid-cols-3 print:gap-6">
          {codes.map((c) => (
            <div
              key={c.label}
              className={cn(
                "flex flex-col items-center rounded-2xl border border-border bg-white p-4 text-center",
                "print:break-inside-avoid print:border-black/20"
              )}
            >
              <img src={c.dataUrl} alt={`QR for ${c.label}`} className="h-40 w-40" />
              <p className="mt-2 font-display text-lg font-semibold text-ink">{restaurant.name}</p>
              <p className="text-sm font-medium text-muted">{c.label}</p>
              <p className="mt-1 text-xs text-muted">Scan to order</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
