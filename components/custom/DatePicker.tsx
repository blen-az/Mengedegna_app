import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DatePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({
  isVisible,
  onClose,
  onSelectDate,
  selectedDate,
  minDate = new Date(),
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3)),
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Get the days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isBeforeMinDate = date < new Date(minDate.setHours(0, 0, 0, 0));
      const isAfterMaxDate = date > new Date(maxDate.setHours(23, 59, 59, 999));
      
      days.push({
        day: i,
        isCurrentMonth: true,
        isSelected: i === selectedDate.getDate() && 
                    currentMonth === selectedDate.getMonth() && 
                    currentYear === selectedDate.getFullYear(),
        isToday: i === new Date().getDate() && 
                 currentMonth === new Date().getMonth() && 
                 currentYear === new Date().getFullYear(),
        isDisabled: isBeforeMinDate || isAfterMaxDate,
        date,
      });
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDate = (day) => {
    if (day.isDisabled || !day.isCurrentMonth) return;
    
    onSelectDate(day.date);
    onClose();
  };

  const renderCalendarDay = ({ item, index }) => {
    if (!item.isCurrentMonth) {
      return <View style={styles.emptyDay} />;
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          item.isSelected && styles.selectedDay,
          item.isToday && styles.today,
          item.isDisabled && styles.disabledDay,
        ]}
        onPress={() => handleSelectDate(item)}
        disabled={item.isDisabled}
      >
        <Text
          style={[
            styles.dayText,
            item.isSelected && styles.selectedDayText,
            item.isToday && styles.todayText,
            item.isDisabled && styles.disabledDayText,
          ]}
        >
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  const isPreviousMonthDisabled = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastDayOfPrevMonth = new Date(prevYear, prevMonth + 1, 0);
    
    return lastDayOfPrevMonth < minDate;
  };

  const isNextMonthDisabled = () => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);
    
    return firstDayOfNextMonth > maxDate;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={Colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarHeader}>
            <TouchableOpacity 
              style={[
                styles.monthNavButton,
                isPreviousMonthDisabled() && styles.disabledNavButton,
              ]}
              onPress={goToPreviousMonth}
              disabled={isPreviousMonthDisabled()}
            >
              <ChevronLeft size={20} color={isPreviousMonthDisabled() ? Colors.gray[400] : Colors.gray[700]} />
            </TouchableOpacity>
            
            <Text style={styles.monthYear}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.monthNavButton,
                isNextMonthDisabled() && styles.disabledNavButton,
              ]}
              onPress={goToNextMonth}
              disabled={isNextMonthDisabled()}
            >
              <ChevronRight size={20} color={isNextMonthDisabled() ? Colors.gray[400] : Colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeek}>
            {DAYS_OF_WEEK.map((day, index) => (
              <Text key={index} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          <FlatList
            data={generateCalendarDays()}
            renderItem={renderCalendarDay}
            keyExtractor={(item, index) => index.toString()}
            numColumns={7}
            scrollEnabled={false}
            contentContainerStyle={styles.calendarGrid}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: '60%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledNavButton: {
    backgroundColor: Colors.gray[50],
  },
  monthYear: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  dayOfWeekText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[600],
  },
  calendarGrid: {
    padding: 8,
  },
  dayCell: {
    width: 36,
    height: 36,
    margin: 6,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    width: 36,
    height: 36,
    margin: 6,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  selectedDayText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  today: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  todayText: {
    color: Colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  disabledDay: {
    opacity: 0.4,
  },
  disabledDayText: {
    color: Colors.gray[400],
  },
});