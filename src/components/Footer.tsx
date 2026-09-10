import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-pink-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={23} className="h-6 w-auto" />
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Střih<span className="text-brand-500">AI</span>
          </span>
        </div>
        <p className="text-xs text-foreground/40">
          Ukázková aplikace inspirovaná nástroji jako Opus Clip. Nahrávej a
          stříhej pouze videa, ke kterým máš práva.
        </p>
      </div>
    </footer>
  );
}
