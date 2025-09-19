import { DateRange } from '../../../../src/shared/domain/value-objects/date-range';

describe('DateRange Value Object', () => {
  describe('Creation', () => {
    it('should create a valid date range', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.startDate).toEqual(startDate);
      expect(dateRange.endDate).toEqual(endDate);
    });

    it('should create date range with same start and end date', () => {
      const date = new Date('2024-01-15');
      
      const dateRange = new DateRange(date, date);
      
      expect(dateRange.startDate).toEqual(date);
      expect(dateRange.endDate).toEqual(date);
    });
  });

  describe('Validation', () => {
    it('should throw error when start date is after end date', () => {
      const startDate = new Date('2024-01-20');
      const endDate = new Date('2024-01-15');
      
      expect(() => new DateRange(startDate, endDate)).toThrow('Start date cannot be after end date');
    });

    it('should throw error for invalid start date', () => {
      const endDate = new Date('2024-01-20');
      
      expect(() => new DateRange(null as any, endDate)).toThrow('Start date is required');
      expect(() => new DateRange(undefined as any, endDate)).toThrow('Start date is required');
      expect(() => new DateRange('invalid' as any, endDate)).toThrow('Start date must be a valid Date');
    });

    it('should throw error for invalid end date', () => {
      const startDate = new Date('2024-01-15');
      
      expect(() => new DateRange(startDate, null as any)).toThrow('End date is required');
      expect(() => new DateRange(startDate, undefined as any)).toThrow('End date is required');
      expect(() => new DateRange(startDate, 'invalid' as any)).toThrow('End date must be a valid Date');
    });

    it('should throw error for dates in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const today = new Date();
      
      expect(() => new DateRange(yesterday, today, true)).toThrow('Start date cannot be in the past');
    });

    it('should allow today as start date', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateRange = new DateRange(today, tomorrow);
      
      expect(dateRange.startDate).toEqual(today);
      expect(dateRange.endDate).toEqual(tomorrow);
    });
  });

  describe('Duration calculation', () => {
    it('should calculate duration in days correctly', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.getDurationInDays()).toBe(5);
    });

    it('should calculate duration for same day as 0', () => {
      const date = new Date('2024-01-15');
      
      const dateRange = new DateRange(date, date);
      
      expect(dateRange.getDurationInDays()).toBe(0);
    });

    it('should calculate duration in hours correctly', () => {
      const startDate = new Date('2024-01-15T10:00:00');
      const endDate = new Date('2024-01-15T18:00:00');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.getDurationInHours()).toBe(8);
    });

    it('should calculate duration in minutes correctly', () => {
      const startDate = new Date('2024-01-15T10:00:00');
      const endDate = new Date('2024-01-15T10:30:00');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.getDurationInMinutes()).toBe(30);
    });
  });

  describe('Date range operations', () => {
    it('should check if date is within range', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.contains(new Date('2024-01-17'))).toBe(true);
      expect(dateRange.contains(new Date('2024-01-15'))).toBe(true);
      expect(dateRange.contains(new Date('2024-01-20'))).toBe(true);
      expect(dateRange.contains(new Date('2024-01-14'))).toBe(false);
      expect(dateRange.contains(new Date('2024-01-21'))).toBe(false);
    });

    it('should check if date range overlaps with another range', () => {
      const range1 = new DateRange(new Date('2024-01-15'), new Date('2024-01-20'));
      const range2 = new DateRange(new Date('2024-01-18'), new Date('2024-01-25'));
      const range3 = new DateRange(new Date('2024-01-21'), new Date('2024-01-25'));
      
      expect(range1.overlaps(range2)).toBe(true);
      expect(range1.overlaps(range3)).toBe(false);
      expect(range2.overlaps(range3)).toBe(true);
    });

    it('should check if date range is before another range', () => {
      const range1 = new DateRange(new Date('2024-01-15'), new Date('2024-01-20'));
      const range2 = new DateRange(new Date('2024-01-21'), new Date('2024-01-25'));
      
      expect(range1.isBefore(range2)).toBe(true);
      expect(range2.isBefore(range1)).toBe(false);
    });

    it('should check if date range is after another range', () => {
      const range1 = new DateRange(new Date('2024-01-15'), new Date('2024-01-20'));
      const range2 = new DateRange(new Date('2024-01-21'), new Date('2024-01-25'));
      
      expect(range2.isAfter(range1)).toBe(true);
      expect(range1.isAfter(range2)).toBe(false);
    });
  });

  describe('Equality', () => {
    it('should be equal to another date range with same dates', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      
      const range1 = new DateRange(startDate, endDate);
      const range2 = new DateRange(startDate, endDate);
      
      expect(range1.equals(range2)).toBe(true);
    });

    it('should not be equal to another date range with different dates', () => {
      const range1 = new DateRange(new Date('2024-01-15'), new Date('2024-01-20'));
      const range2 = new DateRange(new Date('2024-01-16'), new Date('2024-01-20'));
      
      expect(range1.equals(range2)).toBe(false);
    });

    it('should not be equal to non-date range object', () => {
      const range = new DateRange(new Date('2024-01-15'), new Date('2024-01-20'));
      
      expect(range.equals({ startDate: new Date('2024-01-15') } as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return formatted date range string', () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-20');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.toString()).toBe('2024-01-15 to 2024-01-20');
    });

    it('should return formatted date range for same day', () => {
      const date = new Date('2024-01-15');
      
      const dateRange = new DateRange(date, date);
      
      expect(dateRange.toString()).toBe('2024-01-15');
    });
  });

  describe('Static factory methods', () => {
    it('should create date range from today to future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const dateRange = DateRange.fromTodayTo(futureDate);
      
      expect(dateRange.startDate.getDate()).toBe(new Date().getDate());
      expect(dateRange.endDate).toEqual(futureDate);
    });

    it('should create date range for specific number of days', () => {
      const startDate = new Date('2024-01-15');
      
      const dateRange = DateRange.forDays(startDate, 3);
      
      expect(dateRange.startDate).toEqual(startDate);
      expect(dateRange.getDurationInDays()).toBe(3);
    });

    it('should create date range for specific number of hours', () => {
      const startDate = new Date('2024-01-15T10:00:00');
      
      const dateRange = DateRange.forHours(startDate, 2);
      
      expect(dateRange.startDate).toEqual(startDate);
      expect(dateRange.getDurationInHours()).toBe(2);
    });
  });

  describe('Business logic', () => {
    it('should check if range is for hotel stay (overnight)', () => {
      const startDate = new Date('2024-01-15T15:00:00');
      const endDate = new Date('2024-01-17T11:00:00');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.isHotelStay()).toBe(true);
    });

    it('should check if range is for restaurant reservation (same day)', () => {
      const startDate = new Date('2024-01-15T19:00:00');
      const endDate = new Date('2024-01-15T21:00:00');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.isRestaurantReservation()).toBe(true);
    });

    it('should check if range is for event (multiple days)', () => {
      const startDate = new Date('2024-01-15T09:00:00');
      const endDate = new Date('2024-01-17T18:00:00');
      
      const dateRange = new DateRange(startDate, endDate);
      
      expect(dateRange.isEvent()).toBe(true);
    });
  });
});
