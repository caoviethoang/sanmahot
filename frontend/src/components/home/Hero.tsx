export default function Hero() {
  return (
    <section className="relative rounded-[40px] overflow-hidden bg-gray-900 px-6 py-12 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff416c]/40 via-[#ff4b2b]/40 to-black/60 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> CẬP NHẬT TRONG
          NGÀY
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
          MÃ GIẢM GIÁ <br />
          <span className="gradient-text-rainbow">SIÊU HOT</span> HÔM NAY
        </h1>
        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
          Tổng hợp đầy đủ nhất mã Shopee, Lazada, Tiki... Giúp bạn mua sắm không lo về giá. Ưu đãi
          đến 70% mỗi ngày!
        </p>
      </div>
    </section>
  );
}
