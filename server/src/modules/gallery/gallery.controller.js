import { db } from '../../db/prisma.js'

export const galleryController = {
  list(req, res) {
    const list = db.listGallery()
    res.json(list)
  },

  create(req, res, next) {
    try {
      const { title, category, imageUrl, thumbnailUrl, isTall, isWide } = req.body
      if (!title || !imageUrl) {
        return res.status(400).json({ error: 'BadRequest', message: 'Title and imageUrl are required.' })
      }
      const item = db.createGalleryItem({
        title,
        category: category || 'Events',
        imageUrl,
        thumbnailUrl: thumbnailUrl || null,
        isTall: Boolean(isTall),
        isWide: Boolean(isWide)
      })
      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  },

  delete(req, res) {
    const { id } = req.params
    const success = db.deleteGalleryItem(id)
    if (!success) {
      return res.status(404).json({ error: 'NotFound', message: 'Gallery item not found.' })
    }
    res.json({ message: 'Gallery item deleted successfully.' })
  }
}
