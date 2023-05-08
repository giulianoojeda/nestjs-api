import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'giuliano.ojeda@gmail.com',
      password: '123456',
    };
    describe('Signup', () => {
      it('should throw error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw error if email is duplicated', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });
    describe('Signin', () => {
      it('should throw error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get User', () => {
      it('should get user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200);
      });
      it('should throw error if token is invalid', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders('Authorization', 'Bearer $S{nothing}')
          .expectStatus(401);
      });
    });
    describe('Edit User', () => {
      const dto: EditUserDto = {
        firstName: 'Giuliano',
        email: 'alvaroojeda2706@gmail.com',
        lastName: 'Ojeda',
      };
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .withBody(dto)
          .expectStatus(200);
      });
      it('should throw error if token is invalid', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders('Authorization', 'Bearer $S{nothing}')
          .expectStatus(401);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        link: 'https://www.linkedin.com/in/giulianoojeda/',
        title: 'Giuliano Ojeda',
        description: 'My LinkedIn profile',
      };

      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(201)
          .withBody(dto)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('Update Bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Alvaro Ojeda',
      };
      it('should update bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title);
      });
    });
    describe('Delete Bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(204);
      });
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
