import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
// Custom async validator
import { mimeType } from './mime-type.validator';

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
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    // the paramMap is an observable because the params in the url can change
    // so we observe it, we can listen to the changes and do things
    this.route.paramMap.subscribe( (paramMapUrl: ParamMap) => {
      if(paramMapUrl.has('postId')){
        this.mode = 'edit';
        this.postId = paramMapUrl.get('postId');
        this.isLoading = true;
        this.postById();
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  postById(){
    this.postsService.getPostById(this.postId)
    .subscribe( response => {
      this.isLoading = false;
      this.post = {
        id: response._id,
        title: response.title,
        content: response.content,
        imagePath: response.imagePath,
        creator: response.creator
      };
      this.setFormValues();
    })
  }

  initForm(){
    this.form = new FormGroup({
      title: new FormControl(null,{
        validators: [
          // OOTB Angular validators with module Validators
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(4)
        ]
      }),
      image: new FormControl(null, {
        validators: [
          Validators.required
        ],
        // Own Async Validator
        asyncValidators: [mimeType]
      }
      )
    })
  }

  setFormValues(){
    this.form.setValue({
      title: this.post.title,
      content: this.post.content,
      image: this.post.imagePath
    })
  }

  createPost(){
    if(this.form.invalid)
      return;
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image)
    }
    this.form.reset();
  }

  // Object Event is OOTB
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
