import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// The second way to tell Angular this is a Service and I want to have an instance of it
// Where is call
@Injectable({providedIn: 'root'})
export class PostsService{
    posts: Post[] = [];
    // Subject joue le rôle d'un Observable dont on pourra subscribe avec un Observer
    private postUpdated = new Subject<{posts: Post[], postCount: number}>()

    constructor(private http: HttpClient, private router: Router){

    }

    // La methode get renvoit un Observable
    // On va subscribe à cet Observable et ainsi utiliser les méthodes d'un Observer
    // next(value), error(err), complete(); 
    getStore(){
        this.http.get('http://localhost:3000/api/posts/')
            .subscribe(
                (data) => {console.log(data)},
                (error) => {console.log(error)},
                () => {console.log('all done !')}
            )
    }

    getPosts(postPerPage: number, currentPage: number){
        const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message: string; posts: any, maxPosts: number}>('http://localhost:3000/api/posts'+queryParams)
        // Ici on reformate les données du stream avant de subscribe
            .pipe( map( postData => {
                return{
                    posts: postData.posts.map( post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            }))
            // Ici on subscribe sur les données reformatées
            .subscribe(transformedPosts => {
                this.posts = transformedPosts.posts;
                // On ajoute les données à l'Observable Subject
                this.postUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPosts.maxPosts
                });
            })
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    getPostById(id: string){
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
            "http://localhost:3000/api/posts/" + id
          );
    }

    addPost(title: string, content: string, image: File){
        //  Des objets formData fournissent un moyen facile de construire
        // un ensemble de paires clé / valeur
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{message: string, post: Post}>(
        // Coté back, Node JS reconnaitra le type posteData n'étant pas un objet JSON
                'http://localhost:3000/api/posts',
                postData)
                .subscribe( (response) => {
                    this.mainRoute();
                });     
    }

    deletePost(postId: string){
        return this.http.delete('http://localhost:3000/api/posts/'+postId);
    }

    // Le parametre image est soit File (si on update l'image) ou string si on ne fait rien
    updatePost(postId: string, title: string, content: string, image: File | string){
        let postData: Post | FormData;
        if(typeof image === 'object'){
            postData = new FormData();
            postData.append('id', postId);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        }
        else{
            postData = {id: postId, title, content, imagePath: image};
        }
        this.http.put('http://localhost:3000/api/posts/'+postId, postData)
            .subscribe( response => {
                this.mainRoute();
            })
    }

    mainRoute(){
        return this.router.navigate(['/']);
    }
}