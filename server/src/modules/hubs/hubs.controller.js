import { db } from '../../db/prisma.js'

export const hubsController = {
  list(req, res) {
    const hubs = db.listHubs()
    res.json(hubs)
  },

  get(req, res) {
    const { slug } = req.params
    const hub = db.findHubBySlug(slug)
    if (!hub) {
      return res.status(404).json({ error: 'NotFound', message: 'Hub not found.' })
    }
    res.json(hub)
  },

  create(req, res, next) {
    try {
      const { name, slug, category, icon, color, tint, tagline, description } = req.body
      if (!name || !slug) {
        return res.status(400).json({ error: 'BadRequest', message: 'Name and slug are required.' })
      }
      const existing = db.findHubBySlug(slug)
      if (existing) {
        return res.status(409).json({ error: 'Conflict', message: 'A hub with this slug already exists.' })
      }
      const hub = db.createHub({
        name,
        slug,
        category: category || 'Creative',
        icon: icon || 'Sparkles',
        color: color || '#4f46e5',
        tint: tint || '#eef2ff',
        tagline: tagline || '',
        description: description || ''
      })
      res.status(201).json(hub)
    } catch (err) {
      next(err)
    }
  },

  update(req, res, next) {
    try {
      const { slug } = req.params
      const updated = db.updateHub(slug, req.body)
      if (!updated) {
        return res.status(404).json({ error: 'NotFound', message: 'Hub not found.' })
      }
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }
}
