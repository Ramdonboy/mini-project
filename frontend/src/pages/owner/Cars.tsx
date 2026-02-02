import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Car } from 'lucide-react';
import { carsApi, Car as CarType } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function OwnerCars() {
  const { user } = useAuth();
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CarType | null>(null);
  const [form, setForm] = useState({
    model: '',
    brand: '',
    type: 'SEDAN',
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    pricePerDay: '',
    description: '',
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const { data } = await carsApi.getMyCars();
      setCars(data);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      model: '',
      brand: '',
      type: 'SEDAN',
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      pricePerDay: '',
      description: '',
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (car: CarType) => {
    setEditing(car);
    setForm({
      model: car.model,
      brand: car.brand,
      type: car.type,
      fuelType: car.fuelType,
      transmission: car.transmission,
      pricePerDay: String(car.pricePerDay),
      description: car.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay),
      };
      if (editing) {
        await carsApi.update(editing.id, payload);
      } else {
        await carsApi.create(payload);
      }
      resetForm();
      loadCars();
    } catch {
      alert('Failed to save car');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this car?')) return;
    try {
      await carsApi.delete(id);
      loadCars();
    } catch {
      alert('Failed to delete. Car may have active bookings.');
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Add Car
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Car</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              {['SEDAN', 'SUV', 'LUXURY', 'COMPACT', 'VAN'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              {['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={form.transmission}
              onChange={(e) => setForm({ ...form, transmission: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              {['AUTOMATIC', 'MANUAL'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price per day"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              step="0.01"
              required
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2 border rounded-lg md:col-span-2"
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {editing ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
              <p className="text-sm text-gray-600">{car.type} • ${car.pricePerDay}/day</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cars.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          No cars yet. Add your first car to start earning.
        </div>
      )}
    </div>
  );
}
