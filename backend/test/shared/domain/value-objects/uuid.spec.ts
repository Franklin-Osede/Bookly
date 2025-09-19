import { UUID } from '../../../../src/shared/domain/value-objects/uuid';

describe('UUID Value Object', () => {
  describe('Creation', () => {
    it('should create a valid UUID', () => {
      const uuid = new UUID();
      expect(uuid.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{6}$/i);
    });

    it('should create UUID from string', () => {
      const uuidString = '017f22e2-7b23-6c00-8c06-3eaf2d73b774';
      const uuid = new UUID(uuidString);
      expect(uuid.value).toBe(uuidString);
    });

    it('should create multiple UUIDs that are unique', () => {
      const uuid1 = new UUID();
      const uuid2 = new UUID();
      expect(uuid1.value).not.toBe(uuid2.value);
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid UUID format', () => {
      expect(() => new UUID('invalid-uuid')).toThrow('Invalid UUID v6 format');
      expect(() => new UUID('123')).toThrow('Invalid UUID v6 format');
      expect(() => new UUID('550e8400-e29b-41d4-a716-446655440000')).toThrow('Invalid UUID v6 format'); // v4 UUID
      expect(() => new UUID('')).toThrow('Invalid UUID v6 format');
      expect(() => new UUID(' ')).toThrow('Invalid UUID v6 format');
      expect(() => new UUID(null as any)).toThrow('Invalid UUID v6 format');
      // undefined should generate a new UUID, not throw an error
      expect(() => new UUID(undefined as any)).not.toThrow();
    });

    it('should accept valid UUID v6 format', () => {
      const validUuids = [
        '017f22e2-7b23-6c00-8c06-3eaf2d73b774',
        '017f22e2-7b23-6c00-8c06-3eaf2d73b775',
        '017f22e2-7b23-6c00-8c06-3eaf2d73b776'
      ];

      validUuids.forEach(validUuid => {
        const uuid = new UUID(validUuid);
        expect(uuid.value).toBe(validUuid);
      });
    });
  });

  describe('Equality', () => {
    it('should be equal to another UUID with same value', () => {
      const uuidString = '017f22e2-7b23-6c00-8c06-3eaf2d73b774';
      const uuid1 = new UUID(uuidString);
      const uuid2 = new UUID(uuidString);
      
      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should not be equal to another UUID with different value', () => {
      const uuid1 = new UUID('017f22e2-7b23-6c00-8c06-3eaf2d73b774');
      const uuid2 = new UUID('017f22e2-7b23-6c00-8c06-3eaf2d73b775');
      
      expect(uuid1.equals(uuid2)).toBe(false);
    });

    it('should not be equal to non-UUID object', () => {
      const uuid = new UUID('017f22e2-7b23-6c00-8c06-3eaf2d73b774');
      const other = { value: '017f22e2-7b23-6c00-8c06-3eaf2d73b774' };
      
      expect(uuid.equals(other as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return UUID value when converted to string', () => {
      const uuidString = '017f22e2-7b23-6c00-8c06-3eaf2d73b774';
      const uuid = new UUID(uuidString);
      expect(uuid.toString()).toBe(uuidString);
    });
  });

  describe('Version validation', () => {
    it('should only accept UUID v6 (version 6)', () => {
      // Valid v6 UUID
      const v6Uuid = '017f22e2-7b23-6c00-8c06-3eaf2d73b774';
      const uuid = new UUID(v6Uuid);
      expect(uuid.value).toBe(v6Uuid);

      // Invalid v4 UUID
      const v4Uuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(() => new UUID(v4Uuid)).toThrow('Invalid UUID v6 format');
    });
  });

  describe('Static methods', () => {
    it('should generate UUID using static method', () => {
      const uuid = UUID.generate();
      expect(uuid).toBeInstanceOf(UUID);
      expect(uuid.value).toBeDefined();
    });

    it('should create UUID from string using static method', () => {
      const uuidString = '017f22e2-7b23-6c00-8c06-3eaf2d73b774';
      const uuid = UUID.fromString(uuidString);
      expect(uuid.value).toBe(uuidString);
    });
  });
});