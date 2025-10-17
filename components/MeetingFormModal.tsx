'use client';

import { useState, useEffect } from 'react';
import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { Modal, Button } from '@/components/ui';
import { validateMeetingForm } from '@/lib/utils/validators';
import { formatISODateTime } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '@/constants/statusConfig';

interface MeetingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  hospitals: Hospital[];
  meeting?: Meeting | null;
}

export default function MeetingFormModal({
  isOpen,
  onClose,
  onSubmit,
  hospitals,
  meeting,
}: MeetingFormModalProps) {
  const [formData, setFormData] = useState<MeetingFormData>({
    doctorName: '',
    hospitalId: '',
    hospitalName: '',
    hospitalAddress: '',
    dateTime: '',
    status: 'scheduled',
    purpose: '',
    notes: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with meeting data if editing
  useEffect(() => {
    if (meeting) {
      setFormData({
        doctorName: meeting.doctorName,
        hospitalId: meeting.hospitalId,
        hospitalName: meeting.hospitalName,
        hospitalAddress: meeting.hospitalAddress,
        dateTime: meeting.dateTime,
        status: meeting.status,
        purpose: meeting.purpose || '',
        notes: meeting.notes || '',
      });
    } else {
      // Reset form for new meeting
      setFormData({
        doctorName: '',
        hospitalId: '',
        hospitalName: '',
        hospitalAddress: '',
        dateTime: dayjs().add(1, 'hour').startOf('hour').toISOString(),
        status: 'scheduled',
        purpose: '',
        notes: '',
      });
    }
    setErrors([]);
  }, [meeting, isOpen]);

  const handleHospitalChange = (hospitalId: string) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (hospital) {
      setFormData(prev => ({
        ...prev,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalAddress: `${hospital.address}, ${hospital.city}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateMeetingForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors(['Failed to save meeting. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meeting ? 'Edit Meeting' : 'Create New Meeting'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {meeting ? 'Update Meeting' : 'Create Meeting'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4">
            <ul className="text-sm text-red-800 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="font-medium">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Doctor Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Doctor Name *
          </label>
          <input
            type="text"
            value={formData.doctorName}
            onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
            placeholder="Dr. John Doe"
            required
            suppressHydrationWarning
          />
        </div>

        {/* Hospital */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hospital *
          </label>
          <select
            value={formData.hospitalId}
            onChange={(e) => handleHospitalChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
            required
            suppressHydrationWarning
          >
            <option value="">Select a hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name} - {hospital.city}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date and Time *
          </label>
          <input
            type="datetime-local"
            value={formData.dateTime ? dayjs(formData.dateTime).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dateTime: e.target.value ? dayjs(e.target.value).toISOString() : ''
            }))}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
            required
            suppressHydrationWarning
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MeetingStatus }))}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
            suppressHydrationWarning
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purpose
          </label>
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
            placeholder="Regular check-up, consultation, etc."
            suppressHydrationWarning
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all resize-none"
            placeholder="Additional notes..."
            suppressHydrationWarning
          />
        </div>
      </form>
    </Modal>
  );
}
