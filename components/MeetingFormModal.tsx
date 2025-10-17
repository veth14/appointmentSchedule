'use client';

import { useState, useEffect } from 'react';
import { Meeting, MeetingFormData, MeetingStatus } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { Modal, Button } from '@/components/ui';
import { validateMeetingForm } from '@/lib/utils/validators';
import { formatISODateTime } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '@/constants/statusConfig';
import { User, Building2, Calendar, Clock, FileText, AlertCircle, Stethoscope } from 'lucide-react';

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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-slide-in-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-900 mb-1">Please fix the following errors:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Information Section */}
        <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-5 border border-blue-100/50">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            Doctor Information
          </h3>
          
          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-600" />
              Doctor Name *
            </label>
            <input
              type="text"
              value={formData.doctorName}
              onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
              placeholder="Dr. John Doe"
              required
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-5 border border-gray-200/50">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Location
          </h3>
          
          {/* Hospital */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hospital *
            </label>
            <select
              value={formData.hospitalId}
              onChange={(e) => handleHospitalChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
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
        </div>

        {/* Date & Time Section */}
        <div className="bg-gradient-to-br from-purple-50/30 to-white rounded-xl p-5 border border-purple-100/50">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Schedule
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Date and Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-600" />
                Date and Time *
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime ? dayjs(formData.dateTime).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dateTime: e.target.value ? dayjs(e.target.value).toISOString() : ''
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
                suppressHydrationWarning
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="bg-gradient-to-br from-green-50/30 to-white rounded-xl p-5 border border-green-100/50">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Additional Details
          </h3>
          
          {/* Purpose */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Purpose
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
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
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all resize-none shadow-sm hover:shadow-md"
              placeholder="Additional notes about the meeting..."
              suppressHydrationWarning
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
