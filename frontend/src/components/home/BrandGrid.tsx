import { Link } from 'react-router-dom';

interface Brand {
  id: string;
  name: string;
  path: string;
  Logo: React.ComponentType;
}

interface BrandGridProps {
  brands: Brand[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            SÀN THƯƠNG MẠI ĐIỆN TỬ
          </h2>
          <p className="text-gray-500 font-medium italic">
            Lựa chọn mã giảm giá từ các sàn thương mại điện tử hàng đầu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {brands.map(({ id, path, name, Logo }) => (
          <Link
            key={id}
            to={path}
            title={name}
            className="group relative bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-3 px-6 md:px-8 py-8 md:py-10 flex items-center justify-center aspect-[3/2] overflow-hidden will-change-[transform,box-shadow] transition-[transform,box-shadow] duration-500 transform-gpu"
          >
            <div className="w-full h-full flex items-center justify-center relative z-10 transition-[opacity,transform] duration-500 group-hover:opacity-10 group-hover:scale-90 ease-out will-change-[opacity,transform] transform-gpu">
              <Logo />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-500 translate-y-4 group-hover:translate-y-0 z-20 will-change-[opacity,transform] transform-gpu">
              <span className="text-red-700 font-bold text-base md:text-xl leading-tight text-center">
                Mã Giảm Giá
                <br />
                <span className="text-gray-900">{name}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
