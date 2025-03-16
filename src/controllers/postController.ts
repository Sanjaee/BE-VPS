import { Request, Response } from 'express';
import db from '../db'; // Konfigurasi Drizzle
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

interface CustomRequest extends Request {
  user?: { id: number };
}

export const getAllPosts = async (req: Request, res: Response) => {
    try {
      const allPosts = await db.select().from(posts);
  
      res.json({
        success: true,
        message: 'Semua post berhasil diambil',
        data: allPosts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error
      });
    }
  };
  
  // Ambil post berdasarkan ID
  export const getPostById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const post = await db.select().from(posts).where(eq(posts.id, Number(id)));
  
      if (post.length === 0) {
        return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
      }
  
      res.json({
        success: true,
        message: 'Post berhasil diambil',
        data: post[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error
      });
    }
  };

export const createPost = async (req: CustomRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id; // Ambil user ID dari JWT

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const newPost = await db.insert(posts).values({ title, content, userId }).returning();

    res.status(201).json({
      success: true,
      message: 'Post berhasil dibuat',
      data: newPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error
    });
  }
};

export const updatePost = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const postToUpdate = await db.select().from(posts).where(eq(posts.id, Number(id)));

    if (postToUpdate.length === 0) {
      return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
    }

    if (postToUpdate[0].userId !== userId) {
      return res.status(403).json({ success: false, message: 'Anda hanya bisa mengedit post milik Anda sendiri' });
    }

    const updatedPost = await db
      .update(posts)
      .set({ title, content, updatedAt: new Date() })
      .where(eq(posts.id, Number(id)))
      .returning();

    res.json({
      success: true,
      message: 'Post berhasil diperbarui',
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error
    });
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const postToDelete = await db.select().from(posts).where(eq(posts.id, Number(id)));

    if (postToDelete.length === 0) {
      return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
    }

    if (postToDelete[0].userId !== userId) {
      return res.status(403).json({ success: false, message: 'Anda hanya bisa menghapus post milik Anda sendiri' });
    }

    await db.delete(posts).where(eq(posts.id, Number(id)));

    res.json({
      success: true,
      message: 'Post berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error
    });
  }
};
