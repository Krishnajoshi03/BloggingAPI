import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FeedCard } from '../feed-card/feed-card';
import { PostService, UiPost, PostResponse, Category } from '../services/post.service';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeedCard,
    PaginatorModule,
    SkeletonModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.css']
})
export class CategoryPageComponent implements OnInit {
  category: Category | null = null;
  posts: UiPost[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  categoryId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    const categorySlug = this.route.snapshot.paramMap.get('slug');
    const categoryIdParam = this.route.snapshot.paramMap.get('id');
    
    if (categoryIdParam) {
      this.categoryId = Number(categoryIdParam);
      this.loadCategoryAndPosts();
    } else if (categorySlug) {
      // Try to find category by slug
      this.postService.getCategories().subscribe({
        next: (categories) => {
          const foundCategory = categories.find(c => c.slug === categorySlug);
          if (foundCategory) {
            this.category = foundCategory;
            this.categoryId = foundCategory.id;
            this.loadPosts();
          } else {
            this.error = 'Category not found';
            this.loading = false;
          }
        },
        error: () => {
          this.error = 'Failed to load category';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid category';
      this.loading = false;
    }
  }

  loadCategoryAndPosts() {
    if (!this.categoryId) return;

    this.loading = true;
    this.postService.getCategories().subscribe({
      next: (categories) => {
        this.category = categories.find(c => c.id === this.categoryId!) || null;
        if (!this.category) {
          this.error = 'Category not found';
          this.loading = false;
          return;
        }
        this.loadPosts();
      },
      error: () => {
        // If categories endpoint fails, try loading posts anyway
        this.loadPosts();
      }
    });
  }

  loadPosts(page = 0) {
    if (!this.categoryId) return;

    this.loading = true;
    this.error = null;
    this.currentPage = page;

    this.postService.getPostsByCategory(this.categoryId, page, this.pageSize).subscribe({
      next: (response: PostResponse) => {
        this.posts = response.content || response.items || [];
        this.totalRecords = response.totalElements || this.posts.length;
        this.totalPages = response.totalPages || Math.ceil(this.totalRecords / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts', err);
        this.error = 'Failed to load posts. Please try again.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.loadPosts(event.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retry() {
    this.loadPosts(this.currentPage);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}

