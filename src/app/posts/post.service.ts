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
    private postUpdated = new Subject<Post[]>()

    constructor(private http: HttpClient, private router: Router){

    }

    // La methode get renvoit un Observable
    // On va va subscribe cet Observable et ainsi utiliser les méthodes d'un Observer
    // next(value), error(err), complete(); 
    getStore(){
        this.http.get('http://localhost:3000/api/posts/')
            .subscribe(
                (data) => {console.log(data)},
                (error) => {console.log(error)},
                () => {console.log('all done !')}
            )
    }

    getPosts(){
        this.http.get<{message: string; posts: any}>('http://localhost:3000/api/posts')
            .pipe( map( postData => {
                return postData.posts.map( post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    }
                });
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postUpdated.next([...this.posts]);
            })
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    getPostById(id: string){
        return this.http.get<
                {_id: string,title: string,content: string}
            >('http://localhost:3000/api/posts/'+id);
                
    }

    addPost(title: string, content: string){
        const post: Post = {
            id: null,
            title: title,
            content: content
        }
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
                .subscribe( (responseData) => {
                    const id = responseData.postId;
                    post.id = id;
                    this.posts.push(post);
                    this.postUpdated.next([...this.posts]);
                    this.mainRoute();
                });     
    }

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/api/posts/'+postId)
                .subscribe( () => {
                    const updatedPosts = this.posts.filter(post => post.id !== postId);
                    this.posts = updatedPosts;
                    this.postUpdated.next([...this.posts]);
                })
    }

    updatePost(postId: string, title: string, content: string){
        const post: Post = {id: postId, title, content};
        this.http.put('http://localhost:3000/api/posts/'+postId, post)
            .subscribe( response => {
                const updatePost = [...this.posts];
                const oldPostIndex = updatePost.findIndex( p => p.id === post.id);
                updatePost[oldPostIndex] = post;
                this.posts = updatePost;
                this.postUpdated.next([...this.posts]);
                this.mainRoute();
            })
    }

    mainRoute(){
        return this.router.navigate(['/']);
    }
}