export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  constructor(startDate: Date, endDate: Date, validatePastDates: boolean = false) {
    this.validate(startDate, endDate);
    
    if (validatePastDates) {
      this.validatePastDates(startDate);
    }
    
    this._startDate = new Date(startDate);
    this._endDate = new Date(endDate);
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  private validate(startDate: Date, endDate: Date): void {
    if (!startDate) {
      throw new Error('Start date is required');
    }

    if (!endDate) {
      throw new Error('End date is required');
    }

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new Error('Start date must be a valid Date');
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new Error('End date must be a valid Date');
    }

    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }

  private validatePastDates(startDate: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      throw new Error('Start date cannot be in the past');
    }
  }

  getDurationInDays(): number {
    const timeDiff = this._endDate.getTime() - this._startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  getDurationInHours(): number {
    const timeDiff = this._endDate.getTime() - this._startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60));
  }

  getDurationInMinutes(): number {
    const timeDiff = this._endDate.getTime() - this._startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60));
  }

  contains(date: Date): boolean {
    return date >= this._startDate && date <= this._endDate;
  }

  overlaps(other: DateRange): boolean {
    return this._startDate <= other._endDate && this._endDate >= other._startDate;
  }

  isBefore(other: DateRange): boolean {
    return this._endDate < other._startDate;
  }

  isAfter(other: DateRange): boolean {
    return this._startDate > other._endDate;
  }

  equals(other: DateRange): boolean {
    if (!(other instanceof DateRange)) {
      return false;
    }

    return this._startDate.getTime() === other._startDate.getTime() &&
           this._endDate.getTime() === other._endDate.getTime();
  }

  toString(): string {
    const startStr = this._startDate.toISOString().split('T')[0];
    const endStr = this._endDate.toISOString().split('T')[0];
    
    if (startStr === endStr) {
      return startStr;
    }
    
    return `${startStr} to ${endStr}`;
  }

  // Static factory methods
  static fromTodayTo(endDate: Date): DateRange {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new DateRange(today, endDate);
  }

  static forDays(startDate: Date, days: number): DateRange {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    return new DateRange(startDate, endDate);
  }

  static forHours(startDate: Date, hours: number): DateRange {
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + hours);
    return new DateRange(startDate, endDate);
  }

  // Business logic methods
  isHotelStay(): boolean {
    // Hotel stay is typically overnight (spans multiple days or crosses midnight)
    const durationInDays = this.getDurationInDays();
    const startHour = this._startDate.getHours();
    const endHour = this._endDate.getHours();
    
    return durationInDays > 0 || (durationInDays === 0 && startHour < endHour && endHour > 12);
  }

  isRestaurantReservation(): boolean {
    // Restaurant reservation is typically same day, 1-4 hours
    const durationInHours = this.getDurationInHours();
    const durationInDays = this.getDurationInDays();
    
    return durationInDays === 0 && durationInHours >= 1 && durationInHours <= 4;
  }

  isEvent(): boolean {
    // Event is typically multiple days or long duration
    const durationInDays = this.getDurationInDays();
    const durationInHours = this.getDurationInHours();
    
    return durationInDays > 1 || (durationInDays === 1 && durationInHours > 8);
  }
}
