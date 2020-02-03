import { findProductPackaging } from '../utils/orders';
import { PackagingOption } from '../models/products';

describe('Test Packaging Options', () => {
    it('Test 13 CR order', () => {
        const packagingOptions: PackagingOption[] = [
            {
                count: 9,
                price: 16.99
            },
            {
                count: 5,
                price: 9.95
            },
            {
                count: 3,
                price: 5.95
            }
        ];
        const {options, reminder} = findProductPackaging(13, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options.reduce((sum, opt) => sum + ((opt.packs) || 0), 0)).toBe(3);
        expect(options.reduce((sum, opt) => sum + ((opt.packs * opt.price) || 0), 0)).toBeCloseTo(25.85);
    });
    it('Test 14 BM order', () => {
        const packagingOptions: PackagingOption[] = [
            {
                count: 2,
                price: 9.95
            },
            {
                count: 5,
                price: 16.95
            },
            {
                count: 8,
                price: 24.95
            }
        ];
        const {options, reminder} = findProductPackaging(14, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options.reduce((sum, opt) => sum + ((opt.packs) || 0), 0)).toBe(4);
        expect(options.reduce((sum, opt) => sum + ((opt.packs * opt.price) || 0), 0)).toBeCloseTo(53.8);
    });
});