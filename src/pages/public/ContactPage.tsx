import { useState } from "react";
import { Send, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/lib/seo";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useSEO({
    title: "Hubungi Kami",
    description:
      "Hubungi tim Karyzen Store untuk pertanyaan seputar produk, pesanan, atau dukungan teknis. Respons dalam 24 jam pada hari kerja.",
    path: "/kontak",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="badge-warning !px-4 !py-1.5 text-xs font-semibold tracking-wide uppercase mb-4 inline-block">
          Kontak
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
          Hubungi Kami
        </h1>
        <p className="text-text-secondary">
          Kami siap membantu Anda. Kirim pesan dan kami akan merespons secepatnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading font-semibold text-text text-lg mb-2">
                  Pesan Terkirim!
                </h3>
                <p className="text-text-secondary text-sm">
                  Terima kasih telah menghubungi kami. Kami akan merespons dalam
                  waktu 24 jam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input w-full"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input w-full"
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input w-full"
                    placeholder="Perihal pesan Anda"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input w-full resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Email</p>
                <p className="text-sm text-text-secondary">
                  halo@karyzenstore.com
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Alamat</p>
                <p className="text-sm text-text-secondary">
                  Jl. Digital No. 123
                  <br />
                  Jakarta Selatan, 12345
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Jam Operasional</p>
                <p className="text-sm text-text-secondary">
                  Senin - Jumat
                  <br />
                  09.00 - 17.00 WIB
                </p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="card p-6">
            <p className="text-sm font-medium text-text mb-3">
              Ikuti Kami
            </p>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "LinkedIn", "YouTube"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {social}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
