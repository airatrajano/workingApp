import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService, IProductDetail } from './app.service';
import { NgFor } from '@angular/common';
// import { CommonModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HttpClientModule, CommonModule, FormsModule],
  providers: [AppService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'full-stack-exam';
  products: IProductDetail[] = [];
  productId: any;
  productDetail: IProductDetail = {type:'', name: '', price: '', id:''}
  noProduct = 'No product detail';
  showNoProduct: boolean = false;
  selectedTab: string = 'search';
  productTypes:string[] = [];
  informMessage:string = '';

  constructor(private appService: AppService){}

  ngOnInit(){};

  getProductById(){
    this.appService.getProductDetail(this.productId).subscribe((res)=>{
      this.showNoProduct = false;
      this.products = [res];
      
    }, (error)=>{
      this.products = [];
      this.showNoProduct = true;
    })

  }

  async getAllProducts(){
    this.appService.getAllProducts().subscribe((res)=>{
      this.products = res.products;
      if(res.products.length > 0){
        this.showNoProduct = false;
      } else {
        this.showNoProduct = true;
      }
    });
  }

  getProductType(){
    this.appService.getProductType().subscribe((res)=>{
      this.productTypes = res.types;
      console.log(res)
      if(res.types.length > 0){
        this.showNoProduct = false;
      } else {
        this.showNoProduct = true;
      }
    });
  }

  addProduct(){
    this.appService.addProduct(this.productDetail).subscribe((res)=>{
      this.informMessage = res.message;
    }, (error)=>{
      this.informMessage = error.error.error
    })

  }
  deleteProductById(){
    this.appService.deleteProduct(this.productId).subscribe((res)=>{
      this.showNoProduct = false;
      this.informMessage = res.message;
      
    }, (error)=>{
      console.log(error.error.error)
      this.informMessage = error.error.error
      this.showNoProduct = true;
    })

  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.informMessage = '';
    this.products = [];
    this.productId = '';
    if(tab === 'allProducts'){
      this.getAllProducts();
    } else if (tab === 'productTypes'){
      this.getProductType();
    }
  }
}
