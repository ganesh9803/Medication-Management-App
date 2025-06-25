import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import API from '../../services/authAPI';
import { fetchMedications } from '../../features/patient/patientSlice';

export default function CaretakerSelector() {
  const [caretakers, setCaretakers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [page, setPage] = useState(1);
  const caretakersPerPage = 6;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCaretakers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/caretakers');
        setCaretakers(res.data);
      } catch (err) {
        console.error('Failed to fetch caretakers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCaretakers();
  }, []);

  const handleAssign = async () => {
    if (!selectedId) return;

    try {
      setAssigning(true);
      await API.patch('/patient/select-caretaker', { caretakerId: selectedId });
      dispatch(fetchMedications());
    } catch (err) {
      alert('Failed to assign caretaker');
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(caretakers.length / caretakersPerPage);
  const currentCaretakers = caretakers.slice(
    (page - 1) * caretakersPerPage,
    page * caretakersPerPage
  );

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500 text-center">Loading caretakers...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
            {currentCaretakers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 rounded-2xl shadow-md transition border-2
                  ${
                    selectedId === c.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                      : 'border-gray-200 dark:border-zinc-700'
                  } hover:shadow-lg`}
              >
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{c.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.user.email}</p>
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 px-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedId || assigning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-lg font-medium transition"
          >
            {assigning ? 'Assigning...' : 'Assign Selected Caretaker'}
          </button>
        </>
      )}
    </div>
  );
}
