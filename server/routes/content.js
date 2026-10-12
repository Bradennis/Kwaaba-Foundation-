import express from 'express';
import {
  getCollection,
  getAllContent,
  upsertItem,
  deleteItem,
  upsertContent,
} from '../db.js';

const router = express.Router();

// GET /api/content - Get all content (for the public site)
router.get('/content', async (req, res) => {
  try {
    const content = await getAllContent();
    res.json(content);
  } catch (error) {
    console.error('Error getting all content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// GET /api/content/:collection - Get a single collection
router.get('/content/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const validCollections = [
      'slides', 'stats', 'programs', 'board', 'team',
      'events', 'posts', 'gallery', 'newsletters', 'quotes',
      'about', 'founder', 'settings', 'photoAlbums', 'photos'
    ];

    if (!validCollections.includes(collection)) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const items = await getCollection(collection);
    res.json(items);
  } catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// POST /api/content - Bulk update all content
router.post('/content', async (req, res) => {
  try {
    const data = req.body;
    await upsertContent(data);
    res.json({ success: true, updated: Object.keys(data).length });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// GET /api/collection/:name - Get items from a collection
router.get('/collection/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const items = await getCollection(name);
    res.json(items);
  } catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// POST /api/collection/:name - Create item in collection
router.post('/collection/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const item = req.body;

    if (!item.id) {
      item.id = name.slice(0, 2) + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    const collection = await getCollection(name);
    const orderIndex = collection.length;

    const result = await upsertItem(name, item.id, item, orderIndex);
    res.status(201).json({ success: true, id: item.id, ...result });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/collection/:name/:id - Update item
router.put('/collection/:name/:id', async (req, res) => {
  try {
    const { name, id } = req.params;
    const updates = req.body;

    const collection = await getCollection(name);
    const existing = collection.find(item => item.id === id);

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updated = { ...existing, ...updates, id };
    const orderIndex = existing.order !== undefined ? existing.order : collection.indexOf(existing);

    const result = await upsertItem(name, id, updated, orderIndex);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/collection/:name/:id - Delete item
router.delete('/collection/:name/:id', async (req, res) => {
  try {
    const { name, id } = req.params;
    await deleteItem(name, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// POST /api/collection/:name/reorder - Reorder items
router.post('/collection/:name/reorder', async (req, res) => {
  try {
    const { name } = req.params;
    const { order } = req.body;

    for (let i = 0; i < order.length; i++) {
      await upsertItem(name, order[i], { id: order[i] }, i);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering:', error);
    res.status(500).json({ error: 'Failed to reorder items' });
  }
});

export default router;