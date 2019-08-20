import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  
  posts: Post[] = [];
  isLoading = false;
  totalPost = 0;
  postPerPage= 2;
  // User will choose between 1, 2 or 10 per page
  pageSizeOptions = [1,2, 10];
  currentPage = 1;
  private postsSub: Subscription;
  private authStatusSubds: Subscription;
  userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdatedListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
          this.isLoading = false;
          this.totalPost = postData.postCount;
          this.posts = postData.posts;
        });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubds = this.authService.getAuthStatusListener()
          .subscribe( isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
          })
  }

  ngOnDestroy(){
    // will prevent the memory leak
    this.postsSub.unsubscribe();
    this.authStatusSubds.unsubscribe();
  }

  onDeletePost(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe( () => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      })
  }

  onClickConsoleLogPosts(){
    console.log(this.posts);
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }
}
