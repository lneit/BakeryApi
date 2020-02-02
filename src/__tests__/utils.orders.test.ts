import { calcPacks, calcOptions, findProductPackaging } from '../utils/orders';
import { PackagingOption } from '../models/products';

describe('Test Packaging Options', () => {
    const packagingOptions: PackagingOption[] = [
        {
            count: 2,
            price: 6
        },
        {
            count: 5,
            price: 10
        },
        {
            count: 3,
            price: 7
        }
    ];
    it('Test calculation of packs given the number of products ordered and one packaging option', () => {
        let [packCount, reminder] = calcPacks(14, 8);

        expect(packCount).toBe(1);
        expect(reminder).toBe(6);

        [packCount, reminder] = calcPacks(14, 5);
        expect(packCount).toBe(2);
        expect(reminder).toBe(4);

        [packCount, reminder] = calcPacks(1, 2);
        expect(packCount).toBe(0);
        expect(reminder).toBe(1);
    });

    it('Test calculation of pack options given the number of products ordered and a list of packaging options', () => {
        const {options, reminder} = calcOptions(4, packagingOptions.sort((b, a) => a.count - b.count));

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(1);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(3);
    });
    it('Test calculation of pack options given the number of products ordered and a list of packaging options', () => {
        const {options, reminder} = calcOptions(4, packagingOptions.sort((b, a) => a.count - b.count));

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(1);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(3);
        expect(options[0].packs).toBe(1);
    });
    it('Test 1 item order, unsuccessful', () => {
        const {options, reminder} = findProductPackaging(1, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(1);
        expect(options.length).toBe(0);
    });

    it('Test 2 items order', () => {
        const {options, reminder} = findProductPackaging(2, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(2);
        expect(options[0].packs).toBe(1);
    });
    it('Test 3 items order', () => {
        const {options, reminder} = findProductPackaging(3, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(3);
        expect(options[0].packs).toBe(1);
    });
    it('Test 4 items order', () => {
        const {options, reminder} = findProductPackaging(4, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(2);
        expect(options[0].packs).toBe(2);
    });
    it('Test 5 items order', () => {
        const {options, reminder} = findProductPackaging(5, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(1);
    });
    it('Test 6 items order', () => {
        const {options, reminder} = findProductPackaging(6, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(3);
        expect(options[0].packs).toBe(2);
    });
    it('Test 7 items order', () => {
        const {options, reminder} = findProductPackaging(7, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(1);
        expect(options[1].count).toBe(2);
        expect(options[1].packs).toBe(1);
    });
    it('Test 8 items order', () => {
        const {options, reminder} = findProductPackaging(8, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(1);
        expect(options[1].count).toBe(3);
        expect(options[1].packs).toBe(1);
    });
    it('Test 9 items order', () => {
        const {options, reminder} = findProductPackaging(9, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(1);
        expect(options[1].count).toBe(2);
        expect(options[1].packs).toBe(2);
    });
    it('Test 10 items order', () => {
        const {options, reminder} = findProductPackaging(10, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(1);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(2);
    });
    it('Test 11 items order', () => {
        const {options, reminder} = findProductPackaging(11, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(3);
        expect(options[0].packs).toBe(3);
        expect(options[1].count).toBe(2);
        expect(options[1].packs).toBe(1);
    });
    it('Test 12 items order', () => {
        const {options, reminder} = findProductPackaging(12, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(2);
        expect(options[1].count).toBe(2);
        expect(options[1].packs).toBe(1);
    });
    it('Test 13 items order', () => {
        const {options, reminder} = findProductPackaging(13, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(2);
        expect(options[1].count).toBe(3);
        expect(options[1].packs).toBe(1);
    });
    it('Test calculation of pack options given the number of products ordered and a list of packaging options', () => {

        const {options, reminder} = findProductPackaging(14, packagingOptions);

        expect(typeof options).toBe("object");
        expect(Array.isArray(options)).toBeTruthy();
        expect(reminder).toBe(0);
        expect(options.length).toBe(2);
        expect(options[0].count).toBe(5);
        expect(options[0].packs).toBe(2);
        expect(options[1].count).toBe(2);
        expect(options[1].packs).toBe(2);
    });
});