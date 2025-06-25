import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import API from '../../services/authAPI';
import { markAdherenceStatus, fetchPatientAnalytics } from '../../features/patient/patientSlice';

export default function TodayMedicationCard() {
  const dispatch = useDispatch();
  const { medications } = useSelector((state) => state.patient);
  const today = new Date().toDateString();

  const todaysAdherence = medications.flatMap((med) =>
    med.adherence
      .filter((ad) => new Date(ad.date).toDateString() === today)
      .map((ad) => ({
        ...ad,
        medName: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
      }))
  );

  const [proofFiles, setProofFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const handlePhotoChange = (e, id = 'noMed') => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFiles((prev) => ({ ...prev, [id]: file }));
    setPreviewUrls((prev) => ({ ...prev, [id]: URL.createObjectURL(file) }));
  };

  const handleRemoveImage = (id) => {
    setProofFiles((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setPreviewUrls((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleMarkAsTaken = async (record) => {
    const formData = new FormData();
    formData.append('adherenceId', record.id);
    formData.append('status', 'complete');
    if (proofFiles[record.id]) {
      formData.append('proof', proofFiles[record.id]);
    }

    setUploadingId(record.id);
    try {
      await API.post('/patient/adherence/proof', formData);
      dispatch(markAdherenceStatus({ adherenceId: record.id, status: 'complete' }));
      dispatch(fetchPatientAnalytics()); 
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800">📅 Today's Medication</h2>

      {todaysAdherence.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4 text-base font-medium">No medications assigned for today.</p>

          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl">
            <div className="flex justify-center mb-2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l1.5-1.5a2 2 0 012.828 0L9 7h6l1.5-1.5a2 2 0 012.828 0L21 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <p className="font-semibold text-sm">Add Proof Photo (Optional)</p>
            <p className="text-xs text-gray-500 mb-4">
              Take a photo of your medication or pill organizer as confirmation
            </p>

            <input
              id="file-input-noMed"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, 'noMed')}
              className="hidden"
            />
            <label htmlFor="file-input-noMed">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                📷 Take Photo
              </span>
            </label>

            {previewUrls['noMed'] && (
              <div className="mt-4 relative inline-block w-fit mx-auto">
                <img
                  src={previewUrls['noMed']}
                  alt="Preview"
                  className="h-40 object-contain rounded border"
                />
                <button
                  onClick={() => handleRemoveImage('noMed')}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-sm rounded-full flex items-center justify-center shadow hover:bg-red-700 transform hover:scale-110 transition duration-200"
                  title="Remove photo"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
            disabled
          >
            ✔ Mark as Taken
          </button>
        </div>
      ) : (
        todaysAdherence.map((record) => {
          const isComplete = record.status === 'complete';
          return (
            <div key={record.id} className="mb-6 p-4 border rounded-xl shadow-sm bg-gray-50">
              {isComplete ? (
                <div className="bg-green-100 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-700 font-bold text-lg">Medication Completed!</p>
                  <p className="text-sm text-gray-700">
                    Great job! You've taken your medication for{' '}
                    {new Date(record.date).toDateString()}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-gray-300 p-5 rounded-xl text-center">
                    <div className="flex justify-center mb-2 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7l1.5-1.5a2 2 0 012.828 0L9 7h6l1.5-1.5a2 2 0 012.828 0L21 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                        />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm">Add Proof Photo (Optional)</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Take a photo of your medication or pill organizer
                    </p>

                    <input
                      id={`file-input-${record.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, record.id)}
                      className="hidden"
                    />
                    <label htmlFor={`file-input-${record.id}`}>
                      <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        📷 Take Photo
                      </span>
                    </label>

                    {previewUrls[record.id] && (
                      <div className="mt-4 relative inline-block w-fit mx-auto">
                        <img
                          src={previewUrls[record.id]}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveImage(record.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-sm rounded-full flex items-center justify-center shadow hover:bg-red-700 transform hover:scale-110 transition duration-200"
                          title="Remove photo"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-left">
                    <p className="font-semibold text-lg text-slate-700">Medication: {record.medName}</p>
                    <p className="text-sm text-gray-500">Dosage: {record.dosage}</p>
                    <p className="text-sm text-gray-500">Frequency: {record.frequency}</p>
                  </div>

                  <button
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    disabled={uploadingId === record.id}
                    onClick={() => handleMarkAsTaken(record)}
                  >
                    {uploadingId === record.id ? 'Submitting...' : '✔ Mark as Taken'}
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
