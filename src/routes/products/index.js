import { Router } from 'express';
import { getCategory, getCategoryItems, getItem, getRandomProduct } from '../../models/products-data.js';

const router = Router();

/**
 * The explore functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */

// Route for /explore - redirects to a random product
router.get('/', async (req, res) => {
    const randomProduct = await getRandomProduct();
    res.redirect(`/products/${randomProduct.category}/${randomProduct.id}`);
});

// Route with multiple parameters
router.get('/:category', async (req, res) => {
    const { category, id } = req.params;
    const { display = 'grid' } = req.query;

    // Use await to get data from the model
    const categoryData = await getCategory(category);

    // Check if data exists
    if (!categoryData) {
        return res.status(404).render('errors/404', {
            title: 'Category Not Found'
        });
    }

    const items = await getCategoryItems(category);

    res.render('products', {
        title: `Exploring ${categoryData.name}`,
        display,
        items: items,
        categoryId: category,
        categoryName: categoryData.name,
        categoryDescription: categoryData.description
    });
});

// Redirect item routes to category page
router.get('/:category/:id', async (req, res) => {
    const { category, id } = req.params;

    const product = await getItem(category, id);

    res.render('product', { title: `${product.name}`, product });

});

export default router;