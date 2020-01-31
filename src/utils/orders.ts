import { PackagingOption } from '../models/products';
import { Packaging, ProductPackaging } from '../models/orders';

// Calculates the amount of packages and the reminder of items given the number
// of items (count) and one packaging option.
export const calcPacks = (count: number, option:  number): [number, number] => {
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
export const calcOptions = (ordered: number, packagingOptions: PackagingOption[]): ProductPackaging => {
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

// Finds feasible product packaging option.
export const findProductPackaging = (ordered: number, packagingOptions: PackagingOption[]): ProductPackaging => {
    // Filter packaging options to exclude any that are larger than the ordered number
    let updatedPackagingOptions: PackagingOption[] = packagingOptions.filter(opt => opt.count <= ordered);

    // Sort in the descending order by count
    updatedPackagingOptions.sort((b, a) => a.count - b.count);

    // Initialise the resulting product packaging. Set the reminder to the amount of ordered items.
    let productPackaging: ProductPackaging = {options: [], reminder: ordered};

    while (updatedPackagingOptions.length > 0) {
        productPackaging = calcOptions(ordered, updatedPackagingOptions);

        if (productPackaging.reminder <= 0) {
            break;
        }

        // Update the packaging options reducing the list of options by the
        // last element's count option or, if undefined, shifting the first
        // option out.

        // Find the last element from product packaging options if there is.
        const last: Packaging[] = productPackaging.options.slice(-1);
        let count: number|undefined;
        if (last) {
            count = last[0].count;
            updatedPackagingOptions = updatedPackagingOptions.filter(opt => opt.count !== count);
        } else {
            updatedPackagingOptions.shift();
        }
    }
    return productPackaging;
}