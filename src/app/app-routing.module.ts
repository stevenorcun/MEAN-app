import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'create',
    component: CreatePostComponent
  },
  {
    path: 'edit/:postId',
    component: CreatePostComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  }
];

@NgModule({
  // Here Angular Routes Module is aware about our routes
  imports: [RouterModule.forRoot(routes)],
  // Here we can use our route module outsite (by importiong in app.module.ts)
  exports: [RouterModule]
})
export class AppRoutingModule { }
