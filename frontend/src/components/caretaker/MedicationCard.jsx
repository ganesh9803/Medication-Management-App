//src/components/caretaker/MedicationCard.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMedication, deleteMedication } from '../../features/caretaker/caretakerSlice';
import { Dialog } from '@headlessui/react';

export default function MedicationCard({ medication }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({ ...medication });

  const handleSave = async () => {
    try {
      await dispatch(updateMedication({
        medicationId: form.id,
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency,
        durationDays: form.durationDays
      })).unwrap();

      setEditing(false);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMedication(medication.id)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-2xl shadow-md p-4 transition-all">
      {editing ? (
        <div className="grid gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Medication Name"
          />
          <input
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dosage"
          />
          <input
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Frequency"
          />
          <input
            type="number"
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Duration Days"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmOpen(true)}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              💾 Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">Medication 💊: {medication.name}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Dosage: {medication.dosage}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Frequency: {medication.frequency}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Duration: {medication.durationDays} days</p>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="cursor-pointertext-sm text-red-600 hover:underline dark:text-red-400"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {confirmOpen && (
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg max-w-sm w-full">
              <Dialog.Title className="text-lg font-bold mb-2">Confirm Save</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to save the changes to this medication?
              </Dialog.Description>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Confirm
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
