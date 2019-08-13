import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  constructor(public postsService: PostsService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdatedListener()
        .subscribe((posts: Post[]) => {
          this.isLoading = false;
          this.posts = posts;
        });
  }

  ngOnDestroy(){
    // will prevent the memory leak
    this.postsSub.unsubscribe();
  }

  onDeletePost(postId: string){
    console.log(postId);
    this.postsService.deletePost(postId);
  }

  onClickConsoleLogPosts(){
    console.log(this.posts);
  }
}
