import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSEO } from "@/lib/seo";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Pembayaran
  {
    category: "Pembayaran",
    question: "Metode pembayaran apa yang diterima?",
    answer:
      "Kami menerima pembayaran melalui Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, e-wallet (GoPay, OVO, Dana, ShopeePay), dan transfer bank. Semua pembayaran diproses melalui Midtrans yang aman dan terpercaya.",
  },
  {
    category: "Pembayaran",
    question: "Bagaimana cara menggunakan kupon diskon?",
    answer:
      "Masukkan kode kupon pada halaman keranjang belanja sebelum checkout. Sistem akan memvalidasi kupon dan mengurangi harga secara otomatis. Kupon hanya berlaku jika memenuhi syarat periode dan minimum pembelian.",
  },
  {
    category: "Pembayaran",
    question: "Apakah pembayaran saya aman?",
    answer:
      "Ya, semua transaksi diproses melalui Midtrans yang menggunakan enkripsi SSL 256-bit. Kami tidak menyimpan data kartu kredit atau informasi keuangan sensitif di server kami.",
  },

  // Unduhan
  {
    category: "Unduhan",
    question: "Bagaimana cara mengunduh produk yang sudah dibeli?",
    answer:
      "Setelah pembayaran berhasil, masuk ke Dasbor Saya (/dashboard). Produk berjenis file akan memiliki tombol 'Unduh' yang bisa Anda klik. Tautan unduhan berlaku selama 5-10 menit dan hanya bisa diakses oleh pembeli yang sah.",
  },
  {
    category: "Unduhan",
    question: "Apakah saya bisa mengunduh produk berkali-kali?",
    answer:
      "Ya, Anda bisa mengunduh produk kapan saja selama produk masih tersedia di akun Anda. Setiap unduhan membuat tautan baru yang aman (signed URL).",
  },
  {
    category: "Unduhan",
    question: "Produk saya gagal diunduh, bagaimana?",
    answer:
      "Coba muat ulang halaman dasbor dan unduh ulang. Jika masih bermasalah, hubungi kami melalui halaman Kontak dengan menyertakan nomor order Anda.",
  },

  // Lisensi
  {
    category: "Lisensi",
    question: "Bagaimana cara menggunakan kode lisensi?",
    answer:
      "Kode lisensi akan ditampilkan di halaman 'Lisensi Saya' (/dashboard/licenses). Salin kode tersebut dan gunakan saat mengaktifkan software yang bersangkutan. Setiap kode hanya bisa digunakan untuk satu perangkat.",
  },
  {
    category: "Lisensi",
    question: "Kode lisensi saya tidak bisa digunakan, apa yang harus dilakukan?",
    answer:
      "Pastikan Anda menginput kode dengan benar tanpa spasi. Jika masih bermasalah, hubungi tim dukungan kami melalui halaman Kontak.",
  },

  // Akun
  {
    category: "Akun",
    question: "Bagaimana cara mendaftar akun?",
    answer:
      "Klik tombol 'Masuk' di pojok kanan atas, lalu pilih 'Daftar'. Anda bisa mendaftar menggunakan email atau akun Google. Setelah mendaftar, Anda langsung bisa mulai berbelanja.",
  },
  {
    category: "Akun",
    question: "Bagaimana cara mengubah profil saya?",
    answer:
      "Masuk ke Dasbor Saya, lalu buka halaman 'Pengaturan Akun' (/dashboard/settings). Di sana Anda bisa mengubah nama, email, dan avatar Anda.",
  },

  // Umum
  {
    category: "Umum",
    question: "Apakah ada produk gratis?",
    answer:
      "Ya, beberapa produk kami tersedia secara gratis. Anda bisa menemukannya di katalog produk dengan filter harga Rp0.",
  },
  {
    category: "Umum",
    question: "Bagaimana cara menghubungi dukungan pelanggan?",
    answer:
      "Anda bisa menghubungi kami melalui halaman Kontak (/kontak) atau mengirim email ke halo@karyzenstore.com. Tim kami akan merespons dalam waktu 24 jam pada hari kerja.",
  },
];

const categories = [...new Set(faqData.map((f) => f.category))];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSEO({
    title: "Pertanyaan Umum (FAQ)",
    description:
      "Jawaban atas pertanyaan seputar pembayaran Midtrans, unduhan produk digital, kode lisensi, dan akun Karyzen Store.",
    path: "/faq",
  });

  const filtered = activeCategory
    ? faqData.filter((f) => f.category === activeCategory)
    : faqData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="badge-warning !px-4 !py-1.5 text-xs font-semibold tracking-wide uppercase mb-4 inline-block">
          FAQ
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
          Pertanyaan Umum
        </h1>
        <p className="text-text-secondary">
          Temukan jawaban atas pertanyaan yang sering ditanyakan
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
            !activeCategory
              ? "border-primary text-primary bg-primary/10"
              : "border-white/10 text-text-secondary hover:text-text hover:bg-white/5"
          )}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
              activeCategory === cat
                ? "border-primary text-primary bg-primary/10"
                : "border-white/10 text-text-secondary hover:text-text hover:bg-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-5 text-left"
              >
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="flex-1 font-heading font-semibold text-sm text-text">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-text-secondary transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pl-13 animate-fade-in">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 card p-8">
        <h2 className="text-xl font-heading font-bold text-text mb-3">
          Masih Punya Pertanyaan?
        </h2>
        <p className="text-text-secondary mb-6">
          Hubungi kami dan kami akan membantu Anda dengan senang hati.
        </p>
        <a href="/kontak" className="btn-primary inline-flex items-center gap-2">
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
