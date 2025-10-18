'use client';

import { useState, useEffect } from 'react';
import { Meeting, MeetingFormData, MeetingStatus, RecurrenceFrequency } from '@/types/meeting';
import { Hospital } from '@/types/hospital';
import { Modal, Button } from '@/components/ui';
import { validateMeetingForm } from '@/lib/utils/validators';
import { formatISODateTime } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '@/constants/statusConfig';
import { User, Building2, Calendar, Clock, FileText, AlertCircle, Stethoscope, Repeat } from 'lucide-react';

interface MeetingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  hospitals: Hospital[];
  meeting?: Meeting | null;
  initialDateTime?: Date;
}

export default function MeetingFormModal({
  isOpen,
  onClose,
  onSubmit,
  hospitals,
  meeting,
  initialDateTime,
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
    recurrence: undefined,
  });

  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrenceEndType, setRecurrenceEndType] = useState<'never' | 'on' | 'after'>('never');

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
        recurrence: meeting.recurrence,
      });
      setRecurrenceEnabled(!!meeting.recurrence && meeting.recurrence.frequency !== 'none');
      if (meeting.recurrence?.endDate) {
        setRecurrenceEndType('on');
      } else if (meeting.recurrence?.count) {
        setRecurrenceEndType('after');
      } else {
        setRecurrenceEndType('never');
      }
    } else {
      // Reset form for new meeting
      const defaultDateTime = initialDateTime 
        ? dayjs(initialDateTime).toISOString()
        : dayjs().add(1, 'hour').startOf('hour').toISOString();
        
      setFormData({
        doctorName: '',
        hospitalId: '',
        hospitalName: '',
        hospitalAddress: '',
        dateTime: defaultDateTime,
        status: 'scheduled',
        purpose: '',
        notes: '',
        recurrence: undefined,
      });
      setRecurrenceEnabled(false);
      setRecurrenceEndType('never');
    }
    setErrors([]);
  }, [meeting, isOpen, initialDateTime]);

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
    
    // Prepare form data with recurrence
    const submitData = { ...formData };
    if (recurrenceEnabled && formData.recurrence) {
      // Clean up recurrence based on end type
      submitData.recurrence = {
        ...formData.recurrence,
        endDate: recurrenceEndType === 'on' ? formData.recurrence.endDate : undefined,
        count: recurrenceEndType === 'after' ? formData.recurrence.count : undefined,
      };
    } else {
      submitData.recurrence = undefined;
    }
    
    const validationErrors = validateMeetingForm(submitData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setErrors(['Failed to save meeting. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecurrenceToggle = (enabled: boolean) => {
    setRecurrenceEnabled(enabled);
    if (enabled && !formData.recurrence) {
      setFormData(prev => ({
        ...prev,
        recurrence: {
          frequency: 'weekly',
          interval: 1,
        },
      }));
    }
  };

  const updateRecurrence = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence!,
        [field]: value,
      },
    }));
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital
            </label>
            <div className="relative">
              <select
                value={formData.hospitalId}
                onChange={(e) => handleHospitalChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50 appearance-none cursor-pointer text-gray-900 transition-colors"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-6 border border-blue-200/50 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Schedule Your Appointment
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateTime ? dayjs(formData.dateTime).format('YYYY-MM-DD') : ''}
                  onChange={(e) => {
                    const currentTime = formData.dateTime ? dayjs(formData.dateTime) : dayjs();
                    const newDateTime = dayjs(e.target.value)
                      .hour(currentTime.hour())
                      .minute(currentTime.minute());
                    setFormData(prev => ({ 
                      ...prev, 
                      dateTime: newDateTime.toISOString()
                    }));
                  }}
                  className="w-full px-4 py-3.5 pl-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md hover:border-blue-300 text-gray-900 font-medium"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Time Picker */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.dateTime ? dayjs(formData.dateTime).format('HH:mm') : ''}
                  onChange={(e) => {
                    const currentDate = formData.dateTime ? dayjs(formData.dateTime) : dayjs();
                    const [hours, minutes] = e.target.value.split(':');
                    const newDateTime = currentDate
                      .hour(parseInt(hours))
                      .minute(parseInt(minutes));
                    setFormData(prev => ({ 
                      ...prev, 
                      dateTime: newDateTime.toISOString()
                    }));
                  }}
                  className="w-full px-4 py-3.5 pl-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md hover:border-blue-300 text-gray-900 font-medium"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.dateTime && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Scheduled for:</span>{' '}
                <span className="text-blue-700">
                  {dayjs(formData.dateTime).format('dddd, MMMM D, YYYY [at] h:mm A')}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Recurrence Section */}
        <div className="bg-gradient-to-br from-blue-50/30 to-white rounded-xl p-5 border border-blue-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              Repeat
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={recurrenceEnabled}
                onChange={(e) => handleRecurrenceToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {recurrenceEnabled && (
            <div className="space-y-4 mt-4 animate-slide-in-up">
              {/* Frequency and Interval */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Repeat Every
                  </label>
                  <select
                    value={formData.recurrence?.frequency || 'weekly'}
                    onChange={(e) => updateRecurrence('frequency', e.target.value as RecurrenceFrequency)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
                  >
                    <option value="daily">Day</option>
                    <option value="weekly">Week</option>
                    <option value="monthly">Month</option>
                    <option value="yearly">Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interval
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.recurrence?.interval || 1}
                    onChange={(e) => updateRecurrence('interval', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-sm hover:shadow-md"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                Repeats every {formData.recurrence?.interval || 1}{' '}
                {formData.recurrence?.frequency === 'daily' && (formData.recurrence?.interval === 1 ? 'day' : 'days')}
                {formData.recurrence?.frequency === 'weekly' && (formData.recurrence?.interval === 1 ? 'week' : 'weeks')}
                {formData.recurrence?.frequency === 'monthly' && (formData.recurrence?.interval === 1 ? 'month' : 'months')}
                {formData.recurrence?.frequency === 'yearly' && (formData.recurrence?.interval === 1 ? 'year' : 'years')}
              </div>

              {/* End Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ends
                </label>
                <div className="space-y-3">
                  {/* Never */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'never'}
                      onChange={() => setRecurrenceEndType('never')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Never</span>
                  </label>

                  {/* On Date */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'on'}
                      onChange={() => setRecurrenceEndType('on')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">On</span>
                    <input
                      type="date"
                      value={formData.recurrence?.endDate ? dayjs(formData.recurrence.endDate).format('YYYY-MM-DD') : ''}
                      onChange={(e) => updateRecurrence('endDate', e.target.value ? dayjs(e.target.value).toISOString() : undefined)}
                      disabled={recurrenceEndType !== 'on'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    />
                  </label>

                  {/* After Count */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'after'}
                      onChange={() => setRecurrenceEndType('after')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">After</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.recurrence?.count || ''}
                      onChange={(e) => updateRecurrence('count', e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={recurrenceEndType !== 'after'}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                      placeholder="10"
                    />
                    <span className="text-sm text-gray-700">occurrences</span>
                  </label>
                </div>
              </div>
            </div>
          )}
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
