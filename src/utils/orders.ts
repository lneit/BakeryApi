import { PackagingOption } from '../models/products';
import { ProductPackaging } from '../models/orders';

// Calculates the amount of packages and the reminder of items given the number
// of items (count) and one packaging option.
const calcPacks = (count: number, option:  number): [number, number] => {
    const reminder = count % option;
    let packCount;
    if (reminder === 0) {
        packCount = count / option;
    } else if (reminder === count) {
        packCount = 0;
    } else { // reminder < count
        packCount = Math.floor(count / option);
    }
    return [packCount, reminder]
};

// Calculates packaging options for an ordered number of items (ordered) in one go
// over given packagingOptions list.
const calcOptions = (ordered: number, packagingOptions: PackagingOption[]): ProductPackaging => {
    const options: ProductPackaging = packagingOptions.reduce((packaging: ProductPackaging, {count, price}) => {
        if (packaging.reminder < count) {
            return packaging;
        }

        const [packs, reminder] = calcPacks(packaging.reminder, count);

        if (packs === 0) {
            return packaging;
        }

        return {
            options: [
                ...packaging.options,
                {
                    packs,
                    count,
                    price
                }
            ],
            reminder

        }
      }, {options: [], reminder: ordered});
    return options;
};

// Returns array permutations
const perm = (a: any[]): any[] => a.length ? a.reduce((r, v, i) => [ ...r, ...perm([ ...a.slice(0, i), ...a.slice(i + 1) ]).map((x: any) => [ v, ...x ])], []) : [[]]

// Finds feasible product packaging option.
export const findProductPackaging = (ordered: number, packagingOptions: PackagingOption[]): ProductPackaging => {
    // Initialise the resulting product packaging. Set the reminder to the amount of ordered items.
    let result: ProductPackaging = {options: [], reminder: ordered};

    // Filter packaging options to exclude any that are larger than the ordered number
    const opts: PackagingOption[] = packagingOptions.filter(opt => opt.count <= ordered);
    if (opts.length <= 0) {
        return result;
    }
    const permutations = perm(opts);
    let index = 0;

    let minPrice = -1;
    let minPacks = -1;
    while (index < permutations.length) {
        const productPackaging = calcOptions(ordered, permutations[index]);

        if (productPackaging.reminder <= 0) {
            const price = productPackaging.options.reduce((sum, opt) => sum + ((opt.packs * opt.price) || 0), 0);
            const packs = productPackaging.options.reduce((sum, opt) => sum + ((opt.packs) || 0), 0);
            if ((minPacks < 0 || packs < minPacks) || (minPacks === packs && price < minPrice)) {
                minPacks = packs;
                minPrice = price;
                result = productPackaging;
            }
        }
        index +=1;
    }
    return result;
}