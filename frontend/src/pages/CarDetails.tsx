import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Fuel, Settings2, Calendar } from 'lucide-react';
import { carsApi, bookingsApi } from '../api/services';
import { useAuth as useAuthContext } from '../context/AuthContext';
import type { Car as CarType, BookingSummary } from '../api/services';

type Step = 'dates' | 'summary' | 'done';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('dates');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [booking, setBooking] = useState<{ id: number } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      carsApi.getById(Number(id))
        .then(({ data }) => setCar(data))
        .catch(() => setCar(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchSummary = async () => {
    if (!car || !startDate || !endDate) return;
    setError('');
    try {
      const { data } = await bookingsApi.getSummary(car.id, startDate, endDate);
      setSummary(data);
      setStep('summary');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid dates');
    }
  };

  const confirmBooking = async () => {
    if (!car) return;
    if (!isAuthenticated || user?.role !== 'USER') {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await bookingsApi.create(car.id, startDate, endDate);
      setBooking({ id: data.id });
      setStep('done');
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err ? (err as { response?: { data?: { error?: string } } }).response?.data : null;
      setError(res?.error || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !car) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
        {loading ? 'Loading...' : 'Car not found'}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <Car className="w-24 h-24 text-gray-400" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {car.brand} {car.model}
          </h1>
          <div className="flex gap-4 mt-3 text-gray-600">
            <span className="flex items-center gap-1">
              <Fuel className="w-5 h-5" /> {car.fuelType}
            </span>
            <span className="flex items-center gap-1">
              <Settings2 className="w-5 h-5" /> {car.transmission}
            </span>
          </div>
          <p className="mt-4 text-gray-600">{car.description}</p>
          <div className="mt-4 text-xl font-bold text-primary-600">
            ${car.pricePerDay} / day
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {step === 'dates' && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h2>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={fetchSummary}
                disabled={!startDate || !endDate}
                className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Continue to Summary
              </button>
            </div>
          </>
        )}

        {step === 'summary' && summary && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <div className="space-y-2 text-gray-600">
              <p>{summary.days} days • {summary.startDate} to {summary.endDate}</p>
              <p>Subtotal: ${summary.subtotal.toFixed(2)}</p>
              <p>Tax (10%): ${summary.tax.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-900">Total: ${summary.totalPrice.toFixed(2)}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep('dates')}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={confirmBooking}
                disabled={submitting}
                className="flex-1 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}

        {step === 'done' && booking && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-600 mt-2">Your request has been submitted. The owner will respond soon.</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              View My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
