import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Car } from 'lucide-react';
import { bookingsApi, Booking } from '../api/services';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data } = await bookingsApi.getMyBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      loadBookings();
    } catch (e) {
      alert('Failed to cancel');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No bookings yet.</p>
          <Link to="/" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
            Browse cars to book
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {b.carBrand} {b.carModel}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {b.startDate} – {b.endDate} ({b.days} days)
                  </p>
                  <p className="font-medium text-gray-900 mt-1">${b.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100'}`}>
                  {b.status}
                </span>
                {b.status === 'PENDING' && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
                <Link to={`/cars/${b.carId}`} className="text-primary-600 hover:underline text-sm">
                  View Car
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
