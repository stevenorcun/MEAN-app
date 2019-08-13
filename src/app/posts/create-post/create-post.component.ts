import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  title: string;
  content: string;
  isLoading= false;
  private mode = 'create';
  private postId: string;
  post: Post;
  form: FormGroup;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    // the paramMap is an observable because the params in the url can change
    // so we observe it, we can listen to the changes and do things
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      this.initForm();
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPostById(this.postId)
          .subscribe( post => {
            this.isLoading = false;
            this.post = {
              id: post._id,
              title: post.title,
              content: post.content
            };
            this.setFormValues();
          })
        console.log(this.post);
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  initForm(){
    this.form = new FormGroup({
      'title': new FormControl(null,{
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      'content': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(4)
        ]
      })
    })
  }

  setFormValues(){
    this.form.setValue({
      'title': this.post.title,
      'content': this.post.content
    })
  }

  createPost(){
    console.log(this.form);
    if(this.form.invalid)
      return;
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    }else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }
}
