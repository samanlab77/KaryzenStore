import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Zap } from "lucide-react";
import { useSEO } from "@/lib/seo";

const values = [
  {
    icon: Target,
    title: "Kualitas Terjamin",
    desc: "Setiap produk yang kami jual telah melalui kurasi ketat untuk memastikan kualitas terbaik bagi pelanggan.",
  },
  {
    icon: Eye,
    title: "Transparansi",
    desc: "Kami percaya pada transparansi harga dan kebijakan. Tidak ada biaya tersembunyi.",
  },
  {
    icon: Heart,
    title: "Pelayanan Prima",
    desc: "Tim dukungan kami siap membantu Anda dengan respons cepat dan solusi yang tepat.",
  },
  {
    icon: Users,
    title: "Komunitas",
    desc: "Kami membangun komunitas pembeli dan kreator digital yang saling mendukung.",
  },
  {
    icon: Award,
    title: "Inovasi",
    desc: "Kami terus berinovasi menghadirkan produk digital terbaru sesuai kebutuhan pasar.",
  },
  {
    icon: Zap,
    title: "Kecepatan",
    desc: "Proses pembelian yang cepat dan instan — dari checkout hingga produk di tangan Anda.",
  },
];

export default function AboutPage() {
  useSEO({
    title: "Tentang Kami",
    description:
      "Kenali Karyzen Store — toko produk digital terpercaya di Indonesia sejak 2024. Kualitas terjamin, transparan, dan pelayanan prima.",
    path: "/tentang",
  });

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge-warning !px-4 !py-1.5 text-xs font-semibold tracking-wide uppercase mb-6 inline-block">
              Tentang Kami
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-6">
              Toko Produk Digital yang <span className="text-gradient">Anda Percaya</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Karyzen Store hadir untuk memberikan akses mudah terhadap produk
              digital berkualitas tinggi. Kami percaya bahwa teknologi dan
              kreativitas harus terjangkau oleh semua orang.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">
                Cerita Kami
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Karyzen Store dimulai dari sebuah keyakinan sederhana: setiap
                  orang berhak mendapatkan akses ke produk digital berkualitas
                  dengan mudah dan cepat.
                </p>
                <p>
                  Didirikan pada tahun 2024, kami mulai dengan koleksi kecil
                  produk digital pilihan. Kini, kami telah berkembang menjadi
                  salah satu toko produk digital terpercaya di Indonesia,
                  melayani ribuan pelanggan setiap bulannya.
                </p>
                <p>
                  Kami bekerja sama dengan kreator dan developer terbaik untuk
                  menghadirkan produk-produk yang benar-benar bermanfaat bagi
                  pelanggan kami.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-heading font-bold text-primary">
                      2.500+
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Pelanggan Aktif
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-heading font-bold text-primary">
                      100+
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Produk Digital
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-heading font-bold text-primary">
                      4.9
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Rating Kepuasan
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-heading font-bold text-primary">
                      24/7
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Dukungan Pelanggan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
              Nilai-Nilai Kami
            </h2>
            <p className="text-text-secondary">
              Prinsip yang memandu setiap langkah kami
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">
            Siap Menjelajahi Produk Kami?
          </h2>
          <p className="text-text-secondary mb-8">
            Jelajahi katalog produk digital kami dan temukan yang paling sesuai
            untuk Anda.
          </p>
          <a href="/products" className="btn-primary inline-flex items-center gap-2">
            Lihat Katalog
          </a>
        </div>
      </section>
    </div>
  );
}
