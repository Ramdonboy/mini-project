import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Fuel, Settings2 } from 'lucide-react';
import { carsApi, Car as CarType } from '../api/services';

const TYPES = ['SEDAN', 'SUV', 'LUXURY', 'COMPACT', 'VAN'];
const BRANDS = ['Toyota', 'BMW', 'Honda', 'Mercedes', 'Ford'];

export default function Browse() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    loadCars();
  }, [type, brand]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const { data } = await carsApi.browse({ type: type || undefined, brand: brand || undefined });
      setCars(data);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Cars</h1>
        <p className="text-gray-600 mt-1">Find the perfect car for your next trip</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Brands</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : cars.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          No cars found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link key={car.id} to={`/cars/${car.id}`}>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">
                    {car.brand} {car.model}
                  </h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />{car.fuelType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings2 className="w-4 h-4" />{car.transmission}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-primary-600 font-bold">${car.pricePerDay}/day</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {car.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
