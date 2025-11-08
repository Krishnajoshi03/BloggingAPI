import { Injectable } from '@angular/core';
import { QueryService } from './query-service';
import { URLs } from '../constants/ApiConstants';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface UiPost {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: Date;
  tags: string[];
  commentsCount: number;
  imageUrl?: string;
  authorId?: number;
}

export interface PostDetail extends UiPost {
  content: string;
  category?: string;
  categoryId?: number;
  comments?:Comment[]
}

export interface PostResponse {
  content?: UiPost[];
  items?: UiPost[];
  totalElements?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface Comment {
  cmt_id: number;
  content: string;
  authorName: string;
  authorId: number;
  createdAt: Date;
  postId: number;
}

export interface Category {
  id: number;
  title: string;
  slug?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  currentUserId:string;
  constructor(private query: QueryService,private authService:AuthService) {
    const user = this.authService.getUser();
     this.currentUserId =  user.id??'';
  }
getPostsOfCurrentUser(){
  return this.getPosts(0,20,'createdAt','DESC',URLs.BASE_URL + URLs.GET_POSTS_BY_USER(this.currentUserId));
}
getAllPosts(page:number,pageSize:number){
 return  this.getPosts(page,pageSize,'createdAt','DESC',URLs.BASE_URL + URLs.GET_POSTS);
}
  getPosts(page = 0, pageSize = 20, sortBy = 'createdAt', sortDir = 'DESC',apiURL:string, categoryId?: number): Observable<PostResponse> {
    const params: any = { pageNumber: String(page), pageSize: String(pageSize), sortBy, sortDir };
    if (categoryId) {
      params.categoryId = String(categoryId);
    }
    return this.query.runGetQuery(apiURL, params).pipe(
      map((res: any) => {
        const items =res?.content??res;
        const posts = items.map((p: any) => {
          return {
            id: p.postId ?? p.id,
            title: p.title,
            excerpt: p.content ? (p.content.length > 140 ? p.content.slice(0, 140) + '…' : p.content) : p.excerpt ?? '',
            authorName: p.user?.name ?? p.user?.username ?? p.authorName ?? 'Unknown',
            publishedAt: p.createdAt ? new Date(p.createdAt) : (p.publishedAt ? new Date(p.publishedAt) : new Date()),
            tags: p.category ? [p.category.title ?? p.category] : (p.tags ?? []),
            commentsCount: Array.isArray(p.comments) ? p.comments.length : (p.commentsCount ?? 0),
            imageUrl: p.imageUrl ?? p.featuredImage,
            authorId: p.user?.id ?? p.authorId
          } as UiPost;
        });
        return {
          content: posts,
          items: posts,
          totalElements: res?.totalElements ?? res?.total ?? posts.length,
          totalPages: res?.totalPages ?? Math.ceil((res?.totalElements ?? posts.length) / pageSize),
          pageNumber: res?.pageNumber ?? page,
          pageSize: res?.pageSize ?? pageSize
        } as PostResponse;
      }),
      catchError(err => {
        console.error('Error fetching posts', err);
        return throwError(() => err);
      })
    );
  }

  getPostById(id: number): Observable<PostDetail> {
    return this.query.runGetQuery(URLs.BASE_URL + URLs.GET_POST_BY_ID(String(id))).pipe(
      map((p: any) => {
        return {
          id: p.postId ?? p.id,
          title: p.title,
          content: p.content ?? '',
          excerpt: p.content ? (p.content.length > 140 ? p.content.slice(0, 140) + '…' : p.content) : p.excerpt ?? '',
          authorName: p.user?.name ?? p.user?.username ?? p.authorName ?? 'Unknown',
          publishedAt: p.createdAt ? new Date(p.createdAt) : (p.publishedAt ? new Date(p.publishedAt) : new Date()),
          tags: p.category ? [p.category.title ?? p.category] : (p.tags ?? []),
          commentsCount: Array.isArray(p.comments) ? p.comments.length : (p.commentsCount ?? 0),
          imageUrl: p.imageUrl ?? p.featuredImage,
          authorId: p.user?.id ?? p.authorId,
          category: p.category?.title ?? p.category,
          categoryId: p.category?.id ?? p.categoryId,
          comments:p.comments
        } as PostDetail;
      }),
      catchError(err => {
        console.error('Error fetching post', err);
        return throwError(() => err);
      })
    );
  }

  createPost(post: { title: string; content: string; imageUrl?: string },categoryId:string): Observable<any> {
    const user = this.authService.getUser();
    this.currentUserId = user.id??''; 
    return this.query.runPostQuery(URLs.BASE_URL + URLs.CREATE_POST(String(this.currentUserId),String(categoryId)), post);
  }

  updatePost(id: string, post: { title?: string; content?: string; categoryId?: number; imageUrl?: string }): Observable<any> {
    return this.query.runPutQuery(URLs.BASE_URL + URLs.UPDATE_POST(String(id)), post);
  }

  deletePost(id: string): Observable<any> {
    return this.query.runDeleteQuery(URLs.BASE_URL + URLs.DELETE_POST(String(id)));
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.query.runGetQuery(URLs.BASE_URL + URLs.CREATE_COMMENT, { postId: String(postId) }).pipe(
      map((res: any) => {
        const comments = Array.isArray(res) ? res : (res?.comments ?? res?.items ?? []);
        return comments.map((c: any) => ({
          cmt_id: c.commentId ?? c.id,
          content: c.content,
          authorName: c.user?.name ?? c.user?.username ?? c.authorName ?? 'Unknown',
          authorId: c.user?.id ?? c.authorId,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          postId: c.postId ?? postId
        } as Comment));
      })
    );
  }

  createComment(postId: string, content: string): Observable<Comment> {
    const userId = this.authService.getUser().id??'';
    return this.query.runPostQuery(URLs.BASE_URL + URLs.CREATE_COMMENT(postId,userId), {"content":content}).pipe(
      map((c: any) => ({
        cmt_id: c.cmt_id ?? c.id,
        content: c.content,
        authorName: c.user?.name ?? c.user?.username ?? c.authorName ?? 'Unknown',
        authorId: c.user?.id ?? userId,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        postId: c.postId ?? postId
      } as Comment))
    );
  }

  deleteComment(id: number): Observable<any> {
    return this.query.runDeleteQuery(URLs.BASE_URL + URLs.DELETE_COMMENT(String(id)));
  }

  getCategories(): Observable<Category[]> {
    return this.query.runGetQuery(URLs.BASE_URL + '/categories', {}).pipe(
      map((res: any) => {
        const categories = Array.isArray(res) ? res : (res?.categories ?? res?.items ?? []);
        return categories.map((c: any) => ({
          id: c.categoryId ?? c.id,
          title: c.title ?? c.name,
          slug: c.slug ?? c.title?.toLowerCase().replace(/\s+/g, '-')
        } as Category));
      }),
      catchError(() => {
        // If categories endpoint doesn't exist, return empty array
        return throwError(() => new Error('Categories endpoint not available'));
      })
    );
  }

  getPostsByCategory(categoryId: number, page = 0, pageSize = 20): Observable<PostResponse> {
    return this.getPosts(page, pageSize, 'createdAt', 'DESC', URLs.BASE_URL + URLs.GET_POSTS, categoryId);
  }

  uploadImage(file: File,postId:string): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.query.runPostQuery(URLs.BASE_URL + URLs.UPLOAD_IMAGE(postId), formData).pipe(
      map((res: any) => ({
        url: res?.url ?? res?.imageUrl ?? res?.data?.url ?? res?.body?.url
      }))
    );
  }
}
