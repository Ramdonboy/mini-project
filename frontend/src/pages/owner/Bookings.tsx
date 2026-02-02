import { useState, useEffect } from 'react';
import { bookingsApi, Booking } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export default function OwnerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadBookings();
  }, [user?.id]);

  const loadBookings = async () => {
    if (!user?.id) return;
    try {
      const { data } = await bookingsApi.getOwnerBookings(user.id);
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    if (!user?.id) return;
    try {
      await bookingsApi.updateStatus(id, status, user.id);
      loadBookings();
    } catch {
      alert('Failed to update');
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const pending = bookings.filter((b) => b.status === 'PENDING');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking Requests</h1>
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="font-medium text-amber-800">
            {pending.length} pending request(s) waiting for your response
          </p>
        </div>
      )}
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {b.carBrand} {b.carModel}
              </h3>
              <p className="text-sm text-gray-600">
                Booked by {b.userName} • {b.startDate} – {b.endDate} ({b.days} days)
              </p>
              <p className="font-medium text-gray-900 mt-1">${b.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100'}`}>
                {b.status}
              </span>
              {b.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateStatus(b.id, 'CONFIRMED')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(b.id, 'REJECTED')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          No booking requests yet.
        </div>
      )}
    </div>
  );
}
