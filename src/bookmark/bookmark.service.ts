import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmars(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    dto: EditBookmarkDto,
    bookmarkId: number,
  ) {
    //get bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    //check if bookmark belongs to user
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    //update bookmark
    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return updatedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    //get bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    //check if bookmark belongs to user
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    //delete bookmark
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
