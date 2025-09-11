import { describe, it, expect } from 'vitest';
import { getToolUrl, getToolIdFromSlug, getSlugFromToolId } from '../toolUtils';

describe('toolUtils', () => {
  describe('getToolUrl', () => {
    it('should generate correct URL for known tool IDs', () => {
      expect(getToolUrl('json')).toBe('/tools/json-formatter');
      expect(getToolUrl('uuid')).toBe('/tools/uuid-generator');
      expect(getToolUrl('base64')).toBe('/tools/base64-encoder-decoder');
    });

    it('should fallback to tool ID for unknown tools', () => {
      expect(getToolUrl('unknown-tool')).toBe('/tools/unknown-tool');
    });
  });

  describe('getToolIdFromSlug', () => {
    it('should return correct tool ID for known slugs', () => {
      expect(getToolIdFromSlug('json-formatter')).toBe('json');
      expect(getToolIdFromSlug('uuid-generator')).toBe('uuid');
      expect(getToolIdFromSlug('base64-encoder-decoder')).toBe('base64');
    });

    it('should fallback to slug for unknown slugs', () => {
      expect(getToolIdFromSlug('unknown-slug')).toBe('unknown-slug');
    });
  });

  describe('getSlugFromToolId', () => {
    it('should return correct slug for known tool IDs', () => {
      expect(getSlugFromToolId('json')).toBe('json-formatter');
      expect(getSlugFromToolId('uuid')).toBe('uuid-generator');
      expect(getSlugFromToolId('base64')).toBe('base64-encoder-decoder');
    });

    it('should fallback to tool ID for unknown tools', () => {
      expect(getSlugFromToolId('unknown-tool')).toBe('unknown-tool');
    });
  });
});
