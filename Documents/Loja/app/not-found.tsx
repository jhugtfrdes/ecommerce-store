import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80svh] bg-ink px-4 py-28 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-white">Página não encontrada</h1>
      <p className="mt-4 text-titanium">O produto ou página que procuras não existe.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-platinum px-6 text-sm font-semibold text-ink"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
