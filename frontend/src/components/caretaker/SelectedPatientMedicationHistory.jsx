import { useSelector } from 'react-redux';

export default function SelectedPatientMedicationHistory() {
  const { selectedPatient } = useSelector((state) => state.caretaker);

  if (!selectedPatient) return null;

  const adherence = selectedPatient.medications
    ?.flatMap((med) =>
      med.adherence.map((entry) => ({
        ...entry,
        medName: med.name,
        dosage: med.dosage,
        hasProof: Boolean(entry.proofUrl),
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

  return (
    <div className="bg-white p-4 rounded shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">🧾 Recent Medication Activity</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {adherence?.map((record) => {
          const date = new Date(record.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });
          const time = new Date(record.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });

          return (
            <div
              key={record.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                record.status === 'complete'
                  ? 'bg-green-50 border-green-200'
                  : record.status === 'missed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800">{date}</p>
                <p className="text-sm text-gray-500">
                  {record.status === 'complete'
                    ? `Taken at ${time}`
                    : record.status === 'missed'
                    ? 'Medication missed'
                    : 'Pending'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {record.hasProof && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">📸 Photo</span>
                )}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    record.status === 'complete'
                      ? 'bg-green-500 text-white'
                      : record.status === 'missed'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
