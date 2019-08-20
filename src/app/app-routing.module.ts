import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'create',
    component: CreatePostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId',
    component: CreatePostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];

@NgModule({
  // Here Angular Routes Module is aware about our routes
  imports: [RouterModule.forRoot(routes)],
  // Here we can use our route module outsite (by importiong in app.module.ts)
  exports: [RouterModule],
  // On rajoute notre service Guard, pour la gestion des routes nécéssitant connexion
  // et ainsi ne pas permettre de rentrer l'url manuellement => si no logged => redirection
  providers: [AuthGuard]
})
export class AppRoutingModule { }
