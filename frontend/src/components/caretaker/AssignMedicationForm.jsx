
import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignMedication } from '../../features/caretaker/caretakerSlice';

export default function AssignMedicationForm() {
  const dispatch = useDispatch();
  const { selectedPatient } = useSelector((state) => state.caretaker);

  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    durationDays: '',
  });

  const [errors, setErrors] = useState({});

  const validate = (field, value) => {
    let msg = '';
    if (!value.trim()) msg = 'This field is required';
    if (field === 'durationDays' && (isNaN(value) || value <= 0)) {
      msg = 'Duration must be a positive number';
    }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before dispatch
    const newErrors = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, validate(k, v)])
    );

    setErrors(newErrors);

    if (Object.values(newErrors).every((e) => !e)) {
      dispatch(assignMedication({ patientId: selectedPatient.patientId, ...form, durationDays: Number(form.durationDays) }));
      setForm({ name: '', dosage: '', frequency: '', durationDays: '' });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 sm:p-6 w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
        ➕ Assign Medication
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">

        {/* Medication Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="peer w-full px-3 pt-5 pb-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
            placeholder=" "
          />
          <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-300">
            Medication Name
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E.g., Paracetamol, Ibuprofen</p>
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Dosage */}
        <div className="relative">
          <input
            type="text"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            className="peer w-full px-3 pt-5 pb-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
            placeholder=" "
          />
          <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-300">
            Dosage
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E.g., 500mg, 10ml</p>
          {errors.dosage && <p className="text-sm text-red-600 mt-1">{errors.dosage}</p>}
        </div>

        {/* Frequency */}
        <div className="relative">
          <input
            type="text"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="peer w-full px-3 pt-5 pb-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
            placeholder=" "
          />
          <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-300">
            Frequency
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E.g., Twice a day, Once daily</p>
          {errors.frequency && <p className="text-sm text-red-600 mt-1">{errors.frequency}</p>}
        </div>

        {/* Duration Days */}
        <div className="relative">
          <input
            type="number"
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
            className="peer w-full px-3 pt-5 pb-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
            placeholder=" "
            min="1"
          />
          <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-300">
            Duration (in days)
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How many days should the medication last?</p>
          {errors.durationDays && <p className="text-sm text-red-600 mt-1">{errors.durationDays}</p>}
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Assign Medication
          </button>
        </div>
      </form>
    </div>
  );
}
