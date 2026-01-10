import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface TimeSlot {
  time: string;
  available: boolean;
  vendorId?: string;
}

interface DateTimePickerProps {
  visible: boolean;
  selectedDateTime: Date | null;
  onSelectDateTime: (dateTime: Date) => void;
  onCancel: () => void;
  // Future: vendor availability slots
  availableSlots?: TimeSlot[];
}

export default function DateTimePickerComponent({
  visible,
  selectedDateTime,
  onSelectDateTime,
  onCancel,
  availableSlots,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    selectedDateTime || new Date()
  );
  const [selectedTime, setSelectedTime] = useState<Date>(
    selectedDateTime || new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date();
  };

  // Get maximum date (7 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate;
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleConfirm = () => {
    // Combine date and time
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(selectedTime.getHours());
    combinedDateTime.setMinutes(selectedTime.getMinutes());
    combinedDateTime.setSeconds(0);
    combinedDateTime.setMilliseconds(0);

    onSelectDateTime(combinedDateTime);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Generate default time slots if vendor slots are not provided
  const getDefaultTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true,
      });
    }
    return slots;
  };

  const timeSlots = availableSlots || getDefaultTimeSlots();

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;

    const [hours, minutes] = slot.time.split(':').map(Number);
    const newTime = new Date(selectedTime);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setSelectedTime(newTime);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Select Date & Time
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Choose when you&apos;d like the service
            </ThemedText>
          </ThemedView>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Selection */}
            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Date
              </ThemedText>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateTimeText}>
                  {formatDate(selectedDate)}
                </ThemedText>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={getMinDate()}
                  maximumDate={getMaxDate()}
                />
              )}
            </ThemedView>

            {/* Time Selection - Grid of Time Slots */}
            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Time Slot
              </ThemedText>
              <ThemedText style={styles.sectionDescription}>
                {availableSlots
                  ? 'Select from available time slots'
                  : 'Select a time (8:00 - 17:00)'}
              </ThemedText>

              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((slot, index) => {
                  // Extract hour and minute from slot time
                  const [slotHour, slotMinute] = slot.time.split(':').map(Number);
                  const selectedHour = selectedTime.getHours();
                  const selectedMinute = selectedTime.getMinutes();
                  
                  // Check if the slot matches the selected time
                  const isSelected = slotHour === selectedHour && slotMinute === selectedMinute;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        !slot.available && styles.timeSlotDisabled,
                        isSelected && styles.timeSlotSelected,
                      ]}
                      onPress={() => handleTimeSlotSelect(slot)}
                      disabled={!slot.available}
                    >
                      <ThemedText
                        style={[
                          styles.timeSlotText,
                          !slot.available && styles.timeSlotTextDisabled,
                          isSelected && styles.timeSlotTextSelected,
                        ]}
                      >
                        {slot.time}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Alternative: Manual Time Picker */}
              <TouchableOpacity
                style={styles.manualTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <ThemedText style={styles.manualTimeButtonText}>
                  Or select custom time: {formatTime(selectedTime)}
                </ThemedText>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </ThemedView>

            {/* Selected DateTime Summary */}
            <ThemedView style={styles.summarySection}>
              <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
                Selected:
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </ThemedText>
            </ThemedView>
          </ScrollView>

          {/* Action Buttons */}
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  title: {
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  scrollView: {
    maxHeight: 500,
  },
  section: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  dateTimeButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeSlot: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeSlotSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  timeSlotDisabled: {
    backgroundColor: '#F9F9F9',
    borderColor: '#F0F0F0',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotTextDisabled: {
    color: '#CCCCCC',
  },
  manualTimeButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  manualTimeButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
  summarySection: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 16,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
